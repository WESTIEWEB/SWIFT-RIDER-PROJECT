import Joi from 'joi';

//Riders login
export const loginSchema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')) 
});

export const updateSchema = Joi.object().keys({
    firstName:Joi.string().required(),
    lastName:Joi.string().required(),  
    phone:Joi.string().required(),
    Email:Joi.string().required(), 
});

export const option = {
    abortearly: false,
    errors:{
        wrap:{
            label:''
        }
    }
};