import Joi from 'joi';

const newRoadSchema = Joi.object({
  name: Joi.string().required(),
  width: Joi.number().required(),
  location: Joi.object({
    type: Joi.string().valid('MultiLineString', 'point').required(),
    coordinates: Joi.array()
      .items(Joi.array().items(Joi.number().required()).required())
      .required(),
  }).required(),
});

export default newRoadSchema;
