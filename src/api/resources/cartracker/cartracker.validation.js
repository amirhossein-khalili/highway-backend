import Joi from 'joi';

const locationSchema = Joi.object({
  type: Joi.string().valid('MultiLineString', 'point').default('point').required(),
  coordinates: Joi.array().items(Joi.number()).required(),
});

export const newCartrackerSchema = Joi.object({
  car: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  location: Joi.array().items(locationSchema).required(),
  date: Joi.date().required(),
});

export const nearStationSchema = Joi.object({
  stationId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  range: Joi.number().required(),
  carType: Joi.string().valid('small', 'big').required(),
  date: Joi.date().optional(),
});
