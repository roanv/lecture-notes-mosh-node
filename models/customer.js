const mongoose = require('mongoose');
const Joi = require('joi');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    isGold: {
      type: Boolean,
      default: false
    },
    phone: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    }
}));

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean()
    });
    return schema.validate(customer);
}

async function genSampleData(){
  console.log('Generating sample customers...')
  const sampleData = [
    new Customer({name:'Jane Doe', isGold:false, phone:'123456789'}),
    new Customer({name:'Megan Champion', isGold:true, phone:'108192374'}),
    new Customer({name:'Blake Scott', isGold:false, phone:'5487427'}),
    new Customer({name:'Shani Cream', isGold:false, phone:'642846453'}),
    new Customer({name:'Jason Corne', isGold:false, phone:'86745482'}),
    new Customer({name:'Graeme Slate', isGold:true, phone:'126312778'}),
    new Customer({name:'Christie Chains', isGold:false, phone:'9865436325'}),
    new Customer({name:'Aaron Fluve', isGold:false, phone:'2357734'}),
  ]
  await sampleData.map(async (customer) => {
    //console.log(`Checking if ${customer.name} exists...`);
    const exists = await Customer.findOne({name:customer.name});
    if (!exists) {
      //console.log(`Adding sample customer: ${customer.name}.`);
      await customer.save();
    } else{
      //console.log(`Sample customer ${customer.name} already exists. Skipping...`)
    }
  });
  console.log(`Done generating sample customers.`);
}

exports.Customer = Customer; 
exports.validate = validateCustomer;
exports.genSampleData = genSampleData;