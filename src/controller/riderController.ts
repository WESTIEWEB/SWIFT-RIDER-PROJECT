import { Request, Response, NextFunction } from "express";
import { RiderInstance, RiderAttributes } from "../models/riderModel";
import { GeneratePassword, GenerateSalt, GenerateSignature, loginSchema, option, riderRegisterSchema, validatePassword , updateRiderSchema, verifySignature} from "../utils/validation";
import jwt, { JwtPayload } from "jsonwebtoken";
import {v4 as uuidv4 } from 'uuid';
import { emailHtml, GenerateOTP, mailSent, onRequestOTP } from "../utils/notification";
import { FromAdminMail, userSubject } from "../config";
//@desc Register rider
//@route Post /rider/signup
//@access Public
export const registerRider = async (req: JwtPayload, res: Response, next:NextFunction) => {
  try {
    console.log("req.body", req.body)
    const {  name, email, password, confirmPassword, phone, city, validID, passport, documents } = req.body;
    if(password !== confirmPassword){
        return res.status(400).json({Error:'Password does not match'})
    }
   
    const uuidrider = uuidv4();
    const validateResult = riderRegisterSchema.validate(req.body, option);
    if (validateResult.error) {
      return res
        .status(400)
        .json({ Error: validateResult.error.details[0].message });
    }
    //generate salt
    const salt = await GenerateSalt();
    //generate password
    const userPassword = await GeneratePassword(password, salt);
    console.log("userpassword is ", userPassword)
    //Generate OTP
    const { otp, expiry } = GenerateOTP();
    //check if user exist
    const riderEmail = (await RiderInstance.findOne({
      where: { email: email },
    })) as unknown as RiderAttributes;
    const riderPhone = (await RiderInstance.findOne({
      where: { phone: phone },
    }))
    // let images = req.files 
    // console.log(images)
    // //create user
    if (!riderEmail && ! riderPhone) {
      const rider = await RiderInstance.create({
        id: uuidrider,
        name,
        email,
        password: userPassword,
        salt,
        phone,
        city,
        documents: "",
        validID: "",
        passport: "",
        otp,
        otp_expiry: expiry,
        lng: 0,
        lat: 0,
        verified: false,
        role: 'rider',
      });
    
      const html = emailHtml(otp);
      await mailSent(FromAdminMail, email, userSubject, html);
      const Rider = (await RiderInstance.findOne({
        where: { email: email },
      })) as unknown as RiderAttributes;
      let signature = await GenerateSignature({
        id: Rider.id,
        email: Rider.email,
        verified: Rider.verified,
      });
      //We return signature to the user to be used for authentication.
      return res.status(201).json({
        message: "Rider created successfully",
        signature,
        Rider
      });
    }
    return res.status(400).json({ message: "Rider already exist" });
   
  } catch (err: any) {
    res.status(500).json({
      Error: "Internal Server Error",
      message: err.stack,
      err,
      route: "/riders/riders-signup",
    });
  }
};

export const login = async (req: JwtPayload,res: Response) => {
  try {
    const { email, password } = req.body;
    const {error} = loginSchema.validate(req.body, option);
    if (error) return res.status(400).json({Error: error.details[0].message,
      });
      const rider = await RiderInstance.findOne({
        where: { email: email}
     }) as unknown as RiderAttributes;
     if(rider.verified === true){
        const validation = await validatePassword(password, rider.password, rider.salt);
        if(validation){
           let signature = await GenerateSignature({
              id:rider.id,
              email:rider.email,
              verified:rider.verified
             }) 
           return res.status(200).json({
              message: "succesfully logged in",
              id:rider.id,
              signature,
              email: rider.email,
              verified: rider.verified,
              role: rider.role
           })
        }
        return res.status(400).json({
           Error: "wrong email or password"
        })
     }
     return res.status(400).json({
        message: "User not verified, please verify your account"
     })
  } catch (error) {
    console.error(error);
    res.status(500).json({
      Error: "Internal server Error",
      route: "/riders/login",
    });
  }
};
export const updateRiderProfile = async(req: JwtPayload, res: Response)=>{
  try{
      const id = req.rider.id;
      const {name,phone,email} = req.body
//Joi validation
const validateResult = updateRiderSchema.validate(req.body, option)
  if(validateResult.error) {
      res.status(400).json({
          Error: validateResult.error.details[0].message
      })
  }
//check if the rider is a registered user
const Rider = (await RiderInstance.findOne({where: { id: id }})) as unknown as RiderAttributes;
if(!Rider){
  return res.status(400).json({
      Error: "You are not authorised to update your profile"
  })
}
//Update Record
const updatedRider = await RiderInstance.update(
  {
      name,
      phone,
      email,
  }, { where: { id: id } }) as unknown as RiderAttributes;
if(updatedRider){
  const User = await RiderInstance.findOne({ where: { id: id } }) as unknown as RiderAttributes;
  return res.status(200).json({
    message: 'profile updated successfully',
    User
  })
}
return res.status(400).json({
  Error: "Error occured"
})
  } catch(err){
      return res.status(500).json({
      Error: "Internal server Error",
      route: "/users/update-profile"
      })    
  }
};
/**==================Verify Users==================== **/
export const VerifyUser = async (req: Request, res: Response) => {
  try {
      const token = req.params.signature
      const decode = await verifySignature(token)
      // check if user is a registered user
      const User = await RiderInstance.findOne({
          where: { email: decode.email }
      }) as unknown as RiderAttributes
      if (User) {
          const { otp } = req.body
          //check if the otp submitted by the user is correct and is same with the one in the database
          if (User.otp === parseInt(otp) && User.otp_expiry >= new Date()) {
              //update user
              const updatedUser = await RiderInstance.update({ verified: true },
                  { where: { email: decode.email } }) as unknown as RiderAttributes
              // Generate a new Signature
              let signature = await GenerateSignature({
                  id: updatedUser.id,
                  email: updatedUser.email,
                  verified: updatedUser.verified
              });
              if (updatedUser) {
                  const User = (await RiderInstance.findOne({
                      where: { email: decode.email },
                  })) as unknown as RiderAttributes
                  return res.status(200).json({
                      message: "Your account have been verified successfully",
                      signature,
                      verified: User.verified
                  })
              }
          }
      }
      return res.status(400).json({
          Error: 'invalid credentials or OTP already expired'
      })
  }
  catch (err) {
      res.status(500).json({
          Error: "Internal server Error",
          route: "/users/verify"
      })
  }
}
/**============================Resend OTP=========================== **/
export const ResendOTP = async (req: Request, res: Response) => {
  try{
    const token = req.params.signature;
     const decode = await verifySignature(token);
     // check if user is a registered user
     const User = await RiderInstance.findOne({
         where: { email: decode.email }
     }) as unknown as RiderAttributes;
     if (User) {
         //Generate otp
         const { otp, expiry } = GenerateOTP();
         //update user
         const updatedUser = await RiderInstance.update({ otp, otp_expiry: expiry },
             { where: { email: decode.email } }) as unknown as RiderAttributes;
         if (updatedUser) {
             //Send OTP to user
             // await onRequestOTP(otp, User.phone);
             //send Email
             const html = emailHtml(otp);
             await mailSent(FromAdminMail, User.email, userSubject, html);
             return res.status(200).json({
                 message: "OTP resent successfully, kindly check your eamil or phone number for OTP verification"
             })
         }
     }
     return res.status(400).json({
         Error: 'Error sending OTP'
     })
  }catch(err){
    return res.status(500).json({
         Error: "Internal server Error",
         route: "/users/resend-otp/:signature"
     })
  }
 }

/**============================Rider Dashboard=========================== **/
// export const RiderDashboard = async (req: JwtPayload, res: Response) => {
//   try {
//       const id = req.rider.id;
//       const Rider = await RiderInstance.findOne({ where: { id: id } }) as unknown as RiderAttributes;
//       if (!Rider) {
//           return res.status(400).json({
//               Error: "You are not authorised to view this page"
//           })
//       }
//       const { count: totalOrders } = await OrderInstance.findAndCountAll({
//           where: { rider_id: id }
//       });
//       const { count: totalDelivered } = await OrderInstance.findAndCountAll({
//           where: { rider_id: id, status: "delivered" }
//       });
//       const { count: totalCancelled } = await OrderInstance.findAndCountAll({
//           where: { rider_id: id, status: "cancelled" }
//       });
//       const { count: totalPending } = await OrderInstance.findAndCountAll({
//           where: { rider_id: id, status: "pending" }
//       })
//       else {
//           return res.status(400).json({
//               Error: "Error fetching data"
//           })
//       }
//       return res.status(200).json({
//           totalOrders,
//           totalDelivered,
//           totalCancelled,
//           totalPending
//       })
//   } catch (err) {
//       return res.status(500).json({
//           Error: "Internal server Error",
//           route: "/riders/dashboard"
//       })
//   }
// }
