const mongoose = require('mongoose');

const Course = mongoose.model('Course', new mongoose.Schema({
    name: {
        // validation - only happens in mongoose, mongodb does not give a shit
        type:String, 
        required:true,
        minLength: 5,
        maxLength: 255,
        //match: /regex/
    },
    category:{
        type:String,
        enum: ['web', 'mobile','network'],
        lowercase:true, // automatically converts to lowercase
        trim:true // automatically remove padding
    },
    author: String,
    tags: [String], // many strings
    genres:{ // one or more genres
        type: Array, // many items
        validate: { // custom validator
            validator: function(arr){
                return arr && arr.length > 0; // array exists and has at least 1 item
            }
        }
    },
    collaborators:{ // one or more collabs
        type: Array, 
        validate: { // custom async validator
            isAsync: true,
            validator: function(arr, callback){
                setTimeout(() => { // simulating operation that takes time
                    const result = arr && arr.length > 0;
                    callback(result);
                }, 1000)                
            }
        }
    },
    date: {type: Date, default: Date.now},
    isPublished: Boolean,
    price: {
        type: Number,
        // conditional validation
        // price only required if published is true 
        // cant be arrow function
        required: function(){return this.isPublished;},
        min: 10,
        max: 200,
        get: v => Math.round(v), // custom output formatting
        set: v => Math.round(v) // custom input auto correction
    }
}));

exports.Course = Course;