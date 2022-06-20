const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {User, validate} = require('../models/user');
const _ = require('lodash');

// register
router.post('/', async (req, res) => {

    // check valid input
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    // check user already registered
    let user = await User.findOne({email:req.body.email});
    if (user) return res.status(400).send('User already registered');

    // user = new User({
    //     name:req.body.name,
    //     email:req.body.email,
    //     password:req.body.password
    // });
    user = new User(_.pick(req.body,['name','email','password'])); // same result as above

    await user.save();

    res.send(_.pick(user,['id','name','email'])); 
});

module.exports = router;