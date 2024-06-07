// this function validates the joi schema
const validateSchema = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const validationErrors = error.details.map((detail) => {
        return {
          field: detail.path[0],
          message: detail.message,
        };
      });
      res.status(400).json({ errors: validationErrors });
    } else {
      req.validatedData = value;
      next();
    }
  };
};

export default validateSchema;
