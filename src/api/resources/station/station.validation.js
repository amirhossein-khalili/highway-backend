import Joi from 'joi';

const locationSchema = Joi.object({
  type: Joi.string().valid('point').default('point').required(),
  coordinates: Joi.array().items(Joi.number()).required(),
});

const newStationSchema = Joi.object({
  name: Joi.string().required(),
  tollPerCross: Joi.number().required(),
  location: Joi.array().items(locationSchema).required(),
});

export default newStationSchema;
