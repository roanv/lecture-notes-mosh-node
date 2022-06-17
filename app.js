//const genres = require('./routes/genres');
//const customers = require('./routes/customers');

const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();

require('./database').init('playground');

//require('./middleware').init(app);

//require('./templating').init(app);

// ROUTES
//app.use('/api/customers',customers);
//app.use('/api/genres',genres);

const Author = mongoose.model('Author', new mongoose.Schema({
    name: String,
    bio: String,
    website: String
}))

const Course = mongoose.model('Course', new mongoose.Schema({
    name:String,
    author: { 
        type:mongoose.Schema.Types.ObjectId, 
        ref: 'Author' // referencing author document
    }
}))

async function createAuthor(name,bio,website){
    const author = new Author({
        name,
        bio,
        website
    });
    const result = await author.save();
    console.log(result);
}

async function createCourse(name,author){
    const course = new Course({
        name,
        author        
    });
    const result = await course.save();
    console.log(result);
}

async function listCourses() { 
    const courses = await Course
      .find()
      .populate('author','name -_id') // looks up author document by id // only shows name
      //.populate('category', 'name') // can chain multiple populate's
      .select('name author');
    console.log(courses);
  }
  
//createAuthor('Mosh', 'My bio', 'My Website');

// createCourse('Node Course','62ac39d5b21b30c8af80ecb8');

listCourses();

// START SERVER
const PORT = process.env.PORT || 3000;
//app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));