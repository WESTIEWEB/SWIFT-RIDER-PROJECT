import Joi from "joi";

//Riders login
export const loginSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});

export const option = {
  abortearly: false,
  errors: {
    wrap: {
      label: "",
    },
  },
};

//user edit profile
export const editProfileSchema = Joi.object().keys({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
});
