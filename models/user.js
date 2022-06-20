const mongoose = require('mongoose')
const Joi = require('joi');
const e = require('express');
const config = require('config');
const jwt = require('jsonwebtoken');
const { boolean } = require('joi');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique:true
  },
  password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024
    },
  isAdmin:boolean
});

userSchema.methods.generateAuthToken = function(){ // do not use => here as they do not update "this"
  return jwt.sign({id:this.id, isAdmin: this.isAdmin},config.get('jwtPrivateKey')); // "this" refers to user object
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = Joi.object({
      name: Joi.string().min(5).max(50).required(),
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(1024).required()
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;