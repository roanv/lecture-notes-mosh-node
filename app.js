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

const tagSchema = new mongoose.Schema({
    name: String,
});

const Tag = mongoose.model('Tag', tagSchema);

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
    name:String,
    authorRef: {  // reference only
        type:mongoose.Schema.Types.ObjectId, 
        ref: 'Author' // referencing author document
    },
    authorEmbed: authorSchema,
    author:{ // can also do validation here on top of schema
        type: authorSchema, 
        required:false
        // to apply validation to specific property within sub-document pass in sub-doc schema to super-doc schema:
        // phoneSchema = new Schema({
        // country_code: { type: String, required: true },
        // userSchema = new Schema({
        // phone:phoneSchema
    },
    tags:[tagSchema] // sub array
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

async function createCourse(name,authorRef,authorEmbed,tags){
    const course = new Course({
        name,
        authorRef,
        authorEmbed,
        tags
    });
    const result = await course.save();
    console.log('CREATED COURSE:\n' + result);
}

async function listCourses() { 
    const courses = await Course
      .find()
      .populate('authorRef','name -_id') // looks up author document by id // only shows name
      //.populate('category', 'name') // can chain multiple populate's
      .select('name authorRef authorEmbed tags.name');
    console.log('LISTING COURSES:\n' + courses);
}

async function example(){
    // CLEAR DB
    await Author.deleteMany({});
    await Course.deleteMany({});
    //await Tag.deleteMany({});

    // Tags
    const tags = [new Tag({name:"JavaScript"}), new Tag({name:"Python"})];

    // Referenced Author
    await createAuthor('Mosh Referenced', 'Reference Author', 'My Referenced Website'); // only adds author id (reference) as property on course
    const refAuthor = await Author.findOne({name:'Mosh Referenced'}); // get id to add to course

    // Embedded Author
    const embedAuthor = new Author({name:"Mosh Embedded"}); // document (embedded) to be added to course

    // Course
    await createCourse('Node Course',refAuthor.id,embedAuthor, tags);

    // Update embedded
    const course = await Course.findOne({name:'Node Course'});
    course.authorEmbed.name = 'Mosh Hamedani'; // don't need to query before updating
    const tag = new Tag({name:'C#'}) 
    course.tags.push(tag); // adding to sub array
    const removeTag = course.tags.id(tag.id);
    removeTag.remove(); // removing a sub element // need ID - finding it is tricky
    await course.save();

    // Updating without querying and saving to memory
    const noQueryCourseUpdate = await Course.updateOne({id:course.id}, {
        $set: {
            'authorEmbed.name':'Jane Doe'
        }
    })

    listCourses();
}

example();

// START SERVER
const PORT = process.env.PORT || 3000;
//app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));