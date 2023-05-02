import Joi from "@hapi/joi";
export const userRegister = Joi.object({
  email: Joi.string().email().lowercase().required(),
  username: Joi.string().lowercase().required(),
  password: Joi.string().min(2).max(30).required(),
});

export const userLogin = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(2).max(30).required(),
});
