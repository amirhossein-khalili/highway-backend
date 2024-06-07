import Joi from 'joi';

const signupSchema = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const loginSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export { signupSchema, loginSchema };
