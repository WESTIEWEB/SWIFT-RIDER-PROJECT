import Joi from 'joi';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import {UserPayload, APP_SECRET} from '../config'
import { AccountSid, authToken, fromAdminPhone } from '../config';
dotenv.config()
//Riders login
export const loginSchema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')) 
});

export const option = {
    abortearly: false,
    errors:{
        wrap:{
            label:''
        }
    }
};

// Users Signup
export const registerSchema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phoneNumber: Joi.string(),
    password: Joi.string().regex(/^[a-z0-9]{3,30}$/),
    confirm_password: Joi.any().equal(Joi.ref('password')).required()
    .label('Confirm password').messages({'any.only':'{{#label}} does not match'})
})

export const GenerateSalt = async ()=>{
    return await bcrypt.genSalt()
}

export const GeneratePassword = async(password:string, salt:string)=>{
    return await bcrypt.hash(password, salt)

}
export const GenerateSignature = async (payload:UserPayload)=>{
    
        return jwt.sign(payload, APP_SECRET, {expiresIn:'1d'})
        
}
export const GenerateOTP = () => {
    const otp = Math.floor(1000 + Math.random() * 90000);
    const expiry = new Date();
    expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
    return { otp, expiry };
    // console.log(otp, expiry)
  };
  // 
  export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
  //   console.log(toPhoneNumber, otp, fromAdminPhone, AccountSid, authToken);
  
    try {
      const client = require("twilio")(AccountSid, authToken);
      const response = await client.messages.create({
        body: `Your OTP is ${otp}`,
        to: toPhoneNumber,
        from: fromAdminPhone,
      });
      return response;
    } catch (error) {
      console.log(error);
      return "error sending otp";
    }
  };