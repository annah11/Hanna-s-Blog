const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string()
    .alphanum() 
    .min(3) 
    .max(30) 
    .required()
    .messages({
      'string.base': 'Username must be a string.',
      'string.empty': 'Username cannot be empty.',
      'string.min': 'Username must be at least 3 characters long.',
      'string.max': 'Username cannot exceed 30 characters.',
      'any.required': 'Username is required.',
    }),
  
  email: Joi.string()
    .email() 
    .required()
    .messages({
      'string.email': 'Email must be a valid email address.',
      'string.empty': 'Email cannot be empty.',
      'any.required': 'Email is required.',
    }),

  password: Joi.string()
    .min(8) 
    .max(50) 
    .required()
    .messages({
      'string.empty': 'Password cannot be empty.',
      'string.min': 'Password must be at least 8 characters long.',
      'string.max': 'Password cannot exceed 50 characters.',
      'any.required': 'Password is required.',
    }),
});

module.exports = {
  registerSchema,
};
