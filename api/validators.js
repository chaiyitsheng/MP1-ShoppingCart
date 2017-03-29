var Joi = require('joi');

var Validators = {};

Validators.register = {
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(32).required(),
};






module.exports = Validators;