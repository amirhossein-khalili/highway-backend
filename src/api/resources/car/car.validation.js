import Joi from 'joi';

const newCarSchema = Joi.object().keys({
  type: Joi.string().required(),
  color: Joi.string().required(),
  length: Joi.number().required(),
  loadVolume: Joi.number().optional(),
  owner: Joi.string().required(),
});

export default newCarSchema;
