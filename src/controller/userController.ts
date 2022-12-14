import express, {Request, Response} from 'express'
import { UserAttribute, UserInstance } from '../models/userModel';
import { GenerateOTP, GeneratePassword, GenerateSalt, onRequestOTP, registerSchema , GenerateSignature} from "../utils/validation";
import {v4 as uuidv4} from 'uuid'


export const Signup = async (req: Request, res: Response) => {
    try {
      const { name, phoneNumber, email, password, confirm_password} = req.body; 
    //   if(!name || !phoneNumber || !email || !password){
    //     return res.status(400).json({Error: "fill all the required fields"});
    //   }
      const uuiduser = uuidv4();
  
      const validateResult = registerSchema.validate(req.body);
      if (validateResult.error) {
        return res.status(400).json({
          Error: validateResult.error.details[0].message,
        });
      }
      //Generate salt
  
      const salt = await GenerateSalt();
      const userPassword = (await GeneratePassword(password, salt)) as string;

      const { otp, expiry } = GenerateOTP();
      const User = await UserInstance.findOne({ where: { email:email } });

      console.log('we got to this point')
      if (!User) {
        const user = await UserInstance.create({
          id: uuiduser,
          name,
          phoneNumber,
          email,
          password: userPassword,
          salt: salt,
          address:"",
          otp,
          otp_expiry:expiry,
          longitude:0,
          latitude:0,
          verified: false,
          role: "user",
        });

        await onRequestOTP(otp, phoneNumber);
        // Check if user exist
  
        const User = await UserInstance.findOne({
          where: { email: email }
        }) as unknown as UserAttribute
        const signature = await GenerateSignature({
            id: User.id,
            email:User.email
        })
         return res.status(201).json({
          message: "User created successfully ",
          User,
          signature,
        });
      }
      return res.status(401).json({
        message: "User already exist",
      });
    } catch (error) {
      
      res.status(500).json({
        Error: "E no dey work",
        route: "users/signup",
      });
      console.log(error)
    }
  };
  
  