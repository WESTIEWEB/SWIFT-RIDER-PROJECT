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
    const { firstName, lastName, email, password, confirmPassword, phone, address, image, plateNumber } = req.body;
    // if(password !== confirmPassword){
    //     return res.status(400).json({Error:'Password does not match'})
    // }
    // if(!firstName || !lastName || !email || !password || !confirmPassword || !phone || !address || !image || !plateNumber){
    //     return res.status(400).json({Error:'All fields are required'})
    // }

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

    //Generate OTP
    const { otp, expiry } = GenerateOTP();

    //check if user exist
    const riderEmail = (await RiderInstance.findOne({
      where: { email: email },
    })) as unknown as RiderAttributes;

    const riderPhone = (await RiderInstance.findOne({
      where: { phone: phone },
    }))

    //create user
    if (!riderEmail && ! riderPhone) {
      let rider = await RiderInstance.create({
        id: uuidrider,
        firstName,
        lastName,
        email,
        password: userPassword,
        salt,
        phone,
        address,
        image: req.file,
        plateNumber,
        otp,
        otp_expiry: expiry,
        lng: 0,
        lat: 0,
        verified: false,
        role: 'rider',
      })
      //send OTP
      //await onRequestOTP(otp, phone);

      //send email
      const html = emailHtml(otp);
      await mailSent(FromAdminMail, email, userSubject, html);

      //check if user exist and is fully registered inordr to be issued an identity
      const Rider = (await RiderInstance.findOne({
        where: { email: email },
      })) as unknown as RiderAttributes;

      //Generate a signature
      //This signature hide the user created details or showing them error message.
      //The below details are what would be generated with the message as response.
      let signature = await GenerateSignature({
        id: Rider.id,
        email: Rider.email,
        verified: Rider.verified,
      });
      //We return signature to the user to be used for authentication.
      return res.status(201).json({
        message: "Rider created successfully",
        signature,
        verified: Rider.verified,
      });
    }
    return res.status(400).json({ message: "Rider already exist" });

    console.log(userPassword);
  } catch (err: any) {
    res.status(500).json({
      Error: "E NO DEY WORK",
      message: err.stack,
      route: "/riders/signup",
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
      const {firstName,lastName,phone,email} = req.body
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
      firstName,
      lastName,
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