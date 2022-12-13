import Joi from 'joi';
import jwt,{JwtPayload} from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { APP_SECRET } from '../config/index';
import { AuthPayload } from '../interface/Auth.dto';

///rider signup
export const registerSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    confirmPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    image: Joi.string(),
    plateNumber: Joi.string(),
});





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


export const GenerateSalt = async()=>{
    return await bcrypt.genSalt()
}
export const GeneratePassword = async(password:string, salt:string)=>{
    return await bcrypt.hash(password,salt)
}

//GENERATE TOKEN FOR A USER
export const GenerateSignature = async(payload:AuthPayload)=>{
    return jwt.sign(payload, APP_SECRET,{expiresIn:'1d'})
}

export const verifySignature=async(signature:string)=>{
    return jwt.verify(signature, APP_SECRET) as JwtPayload  
}

export const validatePassword = async (enteredPassword:string, savedPassword:string, salt:string) =>{
    return await GeneratePassword(enteredPassword, salt) === savedPassword
    }