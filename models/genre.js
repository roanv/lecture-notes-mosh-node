const mongoose = require('mongoose');
const Joi = require('joi');
const e = require('express');

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
})

const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(genre);
}

async function genSampleData(){
  console.log('Generating sample genres...')
  const sampleData = [
    new Genre({name:'Horror'}),
    new Genre({name:'Sci-Fi'}),
    new Genre({name:'Drama'}),
    new Genre({name:'Comedy'}),
    new Genre({name:'Action'}),
    new Genre({name:'Thriller'}),
    new Genre({name:'Romance'}),
    new Genre({name:'Adventure'}),
  ]
  await sampleData.map(async (genre) => {
    //console.log(`Checking if ${genre.name} exists...`);
    const exists = await Genre.findOne({name:genre.name});
    if (!exists) {
      //console.log(`Adding sample genre: ${genre.name}.`);
      await genre.save();
    } else{
      //console.log(`Sample genre ${genre.name} already exists. Skipping...`)
    }
  });
  console.log(`Done generating sample genres.`);
}

exports.validate = validateGenre;
exports.Genre = Genre; 
exports.genreSchema = genreSchema;

exports.genSampleData = genSampleData;
