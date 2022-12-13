import Joi from 'joi';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
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
    Name: Joi.string().required(),
    Email: Joi.string().required(),
    PhoneNumber: Joi.string(),
    Password: Joi.string().regex(/^[a-z0-9]{3,30}$/),
    Confirm_password: Joi.any().equal(Joi.ref('Password')).required()
    .label('Confirm password').messages({'any.only':'{{#label}} does not match'})
})

export const GenerateSalt = async ()=>{
    return await bcrypt.genSalt()
}

export const GeneratePassword = async(password:string, salt:string)=>{
    return await bcrypt.hash(password, salt)

}
// export const GenerateSignature = async (payload:UserPayload)=>{
    
//         return jwt.sign(payload, APP_SECRET, {expiresIn:'1d'})
        
// }