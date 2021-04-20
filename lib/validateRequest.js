module.exports = function (req, next, schema) {
  const opts = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  };
  // Validate schema created from JOI
  const { value, error } = schema.validate(req.body, opts);
  // Value is correct payload after schema checking
  if (error) {
    // Send error to error middleware
    // Note: The code will run controller, but error handler middleware
    next(error);
  } else {
    req.body = value;
    next();
  }
};
