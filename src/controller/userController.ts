
import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { APP_SECRET, FromAdminMail, userSubject } from "../config";
import { UserAttribute, UserInstance } from "../models/userModel";
import { emailHtml2, mailSent2 } from "../utils";
import { forgotPasswordSchema, GenerateSignature, option, registerSchema, resetPasswordSchema } from "../utils/utility";
import { GenerateSalt, GeneratePassword } from "../utils/utility";
import jwt, { JwtPayload, verify } from "jsonwebtoken";
import bcrypt from "bcrypt";





/** ================== Pick Up User Sign in =============== */
// export const Signup = async (req: Request, res: Response) => {
//   try {
//     const { Name, PhoneNumber, Email, Password} = req.body; 
//     const uuiduser = uuidv4();

//     const validateResult = registerSchema.validate(req.body);
//     if (validateResult.error) {
//       return res.status(400).json({
//         Error: validateResult.error.details[0].message,
//       });
//     }
//     //Generate salt

//     const salt = await GenerateSalt();
//     const userPassword = (await GeneratePassword(Password, salt)) as string;
//     const User = await UserInstance.findOne({ where: { Email:Email } });
//     if (!User) {
//       const user = await UserInstance.create({
//         id: uuiduser,
//         Name,
//         PhoneNumber,
//         Email,
//         Password: userPassword,
//         salt: salt,
//         role: "pickup-user",
//       });

//       const User = await UserInstance.findOne({
//         where: { Email: Email }
//       }) as unknown as UserAttribute
//       const signature = await GenerateSignature({
//           id: User.id,
//           Email:User.Email
//       })
//        return res.status(201).json({
//         message: "User created successfully ",
//         user,
//         signature,
//       });
//     }
//     return res.status(401).json({
//       message: "User already exist",
//     });
//   } catch (error) {
    
//     res.status(500).json({
//       Error: "Internal server error",
//       route: "users/signup",
//     });
//     console.log(error)
//   }
// };


/**=========================== Resend Password ============================== **/

export const forgotPassword = async(req: Request, res: Response) => {
    
    try {
        const {Email} = req.body;

        const validateResult = forgotPasswordSchema.validate(req.body, option);


    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
 }

       //check if the User exist
       const oldUser = (await UserInstance.findOne({
        where: { Email: Email },
      })) as unknown as UserAttribute;

      console.log(oldUser)

    if(!oldUser) {
        return res.status(400).json({
            message: "user not found",
          })
    }

    const secret = APP_SECRET + oldUser.Password;
    const token = jwt.sign({email: oldUser.Email, id: oldUser.id},secret, {expiresIn: "10m"})

     const link = `http://localhost:4000/users/reset-password/${oldUser}/${token}`
    if(oldUser) {
    const html = emailHtml2(link);
     await mailSent2(FromAdminMail, oldUser.Email, userSubject, html);
     return res.status(200).json({
       message: "password reset link sent to email",
    });
}

    console.log(link)
 } catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/forgot-password",
          }); 
    }
}

//On clicking the email link , 
export const resetPasswordGet = async(req:Request, res:Response) => {
    const {id, token} = req.params;

    const oldUser = (await UserInstance.findOne({
        where: {id: id} 
    }))as unknown as UserAttribute
    if(!oldUser) {
        return res.status(400).json({
            message: "User Does Not Exist"
        })
    }
    const secret = APP_SECRET + oldUser.Password;

    try {
         const verify = jwt.verify(token, secret)
         return res.status(200).json({
            email: oldUser.Email,
            verify
             });
    } catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/forgot-password",
          }); 
    }
}
// Page for filling the new password and condfirm password
export const resetPasswordPost  = async( req:Request, res:Response) =>{
    const { id,token } = req.params;
    const {password} = req.body
    const oldUser = (await UserInstance.findOne({
        where: {id: id} 
    }))as unknown as UserAttribute

    const validateResult = resetPasswordSchema.validate(req.body, option);

    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
 }

    if(!oldUser) {
        return res.status(400).json({
            message: "user does not exist"
        })
    }
    const secret = APP_SECRET + oldUser.Password

    try {
        const verify = jwt.verify( token, secret)
        const encryptedPassword = await bcrypt.hash(password, 10)
       const updatedPassword =  (await UserInstance.update(
        {
           Password:  encryptedPassword
         }, {where: {id: id}}
         )) as unknown as UserAttribute
         return res.status(200).json({
            message: "you have succesfully changed your password",
            updatedPassword
            
          });

    } catch (error) {
        
    }
}





