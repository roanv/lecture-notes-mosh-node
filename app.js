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

const authorSchema = new mongoose.Schema({
    name: String,
    bio: String,
    website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
    name:String,
    authorRef: {  // reference only
        type:mongoose.Schema.Types.ObjectId, 
        ref: 'Author' // referencing author document
    },
    authorEmbed: authorSchema,
    author:{ // can also do validation
        type: authorSchema, 
        required:false
        // to apply validation to specific property within sub-document pass in sub-doc schema to super-doc schema:
        // phoneSchema = new Schema({
        // country_code: { type: String, required: true },
        // userSchema = new Schema({
        // phone:phoneSchema
    }
}))

async function createAuthor(name,bio,website){
    const author = new Author({
        name,
        bio,
        website
    });
    const result = await author.save();
    console.log('CREATED AUTHOR\n' + result);
}

async function createCourse(name,authorRef,authorEmbed){
    const course = new Course({
        name,
        authorRef,
        authorEmbed
    });
    const result = await course.save();
    console.log('CREATED COURSE:\n' + result);
}

async function listCourses() { 
    const courses = await Course
      .find()
      .populate('authorRef','name -_id') // looks up author document by id // only shows name
      //.populate('category', 'name') // can chain multiple populate's
      .select('name authorRef authorEmbed');
    console.log('LISTING COURSES:\n' + courses);
}

async function genSampleData(){
    // CLEAR DB
    await Author.deleteMany({});
    await Course.deleteMany({});

    // Referenced Author
    await createAuthor('Mosh Referenced', 'Reference Author', 'My Referenced Website'); // only adds author id (reference) as property on course
    const refAuthor = await Author.findOne({name:'Mosh Referenced'}); // get id to add to course

    // Embedded Author
    const embedAuthor = new Author({name:"Mosh Embedded"}); // document (embedded) to be added to course

    // Course
    await createCourse('Node Course',refAuthor._id,embedAuthor);
    

    // Update embedded
    const course = await Course.findOne({name:'Node Course'});
    course.authorEmbed.name = 'Mosh Hamedani'; // don't need to query before updating
    await course.save();

    // Updating without querying and saving to memory
    const noQueryCourseUpdate = await Course.updateOne({_id:course._id}, {
        $set: {
            'authorEmbed.name':'Jane Doe'
        }
    })

    listCourses();
}

genSampleData();

// START SERVER
const PORT = process.env.PORT || 3000;
//app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));