module.exports = function (req, next, schema) {
  const opts = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  };
  const { value, error } = schema.validate(req.body, opts);
  if (error) {
    next(error);
  } else {
    req.body = value;
    next();
  }
};
