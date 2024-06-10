import Joi from 'joi';

const newCarSchema = Joi.object().keys({
  owner: Joi.string().required(),
  type: Joi.string().valid('small', 'big').required(),
  color: Joi.string().required(),
  length: Joi.number().required(),
  loadVolume: Joi.number().optional(),
});

export default newCarSchema;
