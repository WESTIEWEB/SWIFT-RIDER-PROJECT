import express, {Request, Response} from 'express'
import { UserAttribute, UserInstance } from '../models/userModel';
import { GeneratePassword, GenerateSalt, registerSchema } from "../utils/validation";
import {v4 as uuidv4} from 'uuid'


export const Signup = async (req: Request, res: Response) => {
    try {
      const { Name, PhoneNumber, Email, Password} = req.body; 
      const uuiduser = uuidv4();
  
      const validateResult = registerSchema.validate(req.body);
      if (validateResult.error) {
        return res.status(400).json({
          Error: validateResult.error.details[0].message,
        });
      }
      //Generate salt
  
      const salt = await GenerateSalt();
      const userPassword = (await GeneratePassword(Password, salt)) as string;
      const User = await UserInstance.findOne({ where: { Email:Email } });
      if (!User) {
        const user = await UserInstance.create({
          id: uuiduser,
          Name,
          PhoneNumber,
          Email,
          Password: userPassword,
          salt: salt,
          role: "pickup-user",
        });
        // Check if user exist
  
        const User = await UserInstance.findOne({
          where: { Email: Email }
        }) as unknown as UserAttribute
        // const signature = await GenerateSignature({
        //     id: User.id,
        //     Email:User.Email
        // })
         return res.status(201).json({
          message: "User created successfully ",
          user,
        //   signature,
        });
      }
      return res.status(401).json({
        message: "User already exist",
      });
    } catch (error) {
      
      res.status(500).json({
        Error: "Internal server error",
        route: "users/signup",
      });
      console.log(error)
    }
  };
  
  