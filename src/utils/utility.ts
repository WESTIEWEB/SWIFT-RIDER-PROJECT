import Joi from 'joi';
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { UserPayload } from '../interface/user.dto'
import dotenv from 'dotenv'
import { APP_SECRET } from '../config'
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

export const registerSchema = Joi.object().keys({
    Name: Joi.string().required(),
    Email: Joi.string().required(),
    PhoneNumber: Joi.string(),
    Password: Joi.string().regex(/^[a-z0-9]{3,30}$/),
    Confirm_password: Joi.any().equal(Joi.ref('Password')).required()
    .label('Confirm password').messages({'any.only':'{{#label}} does not match'})
})

// export const option = {
//     abortEarly:false,
//     errors:{
//         wrap:{
//             labels: ''
//         }
//     }
// }

export const GenerateSalt = async ()=>{
    return await bcrypt.genSalt()
}

export const GeneratePassword = async(password:string, salt:string)=>{
    return await bcrypt.hash(password, salt)

}
export const GenerateSignature = async (payload:UserPayload)=>{
    
        return jwt.sign(payload, APP_SECRET, {expiresIn:'1d'})
        
}


//schema for reset Password
export const forgotPasswordSchema = Joi.object().keys({
    email:Joi.string().required()
})

export const resetPasswordSchema = Joi.object().keys({
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/),
    //.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    confirm_password: Joi.any().equal(Joi.ref('password')).required().label('confirm password')
})
