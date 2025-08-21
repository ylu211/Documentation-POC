const Joi = require('joi');

const validateProduct = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    price: Joi.number().positive().required(),
    description: Joi.string().max(500),
    category: Joi.string().valid('electronics', 'clothing', 'books', 'home')
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      error: 'Validation échouée', 
      details: error.details[0].message 
    });
  }
  next();
};

module.exports = { validateProduct };