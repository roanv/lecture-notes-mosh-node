const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const {Customer, validate} = require('../models/customer'); 

router.get('/', (req, res) => {
    res.send('Customers API');
});

router.post('/', async (req, res) => {
  console.log(req.body)
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({ 
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone
  });
  customer = await customer.save();
  
  res.send(customer);
});

module.exports = router; 