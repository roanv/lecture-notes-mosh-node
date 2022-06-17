async function createCourse(){
    const course = new Course({
        name: 'Angular Course',
        author: 'Mosh',
        tags: ['angular','frontend'],
        isPublished: true
    });

    try { // if does not pass validation, promise rejects
        const result = await course.save(); 
        // await course.validate((err) => {if(err){}}); // manual validation also possible
        console.log(result);}
    catch (ex){
        // console.log(ex.message);
        // console.log(ex.errors.genres)
        for (field in ex.errors){
            console.log(ex.errors[field]);
        }
    }
}

//createCourse();

async function getCourses(){
    const pageNumber = 2;
    const pageSize = 10;
    // /api/courses?pageNumber=2&pageSize=10 // real world input

    // eq (equal)
    // ne (not equal)
    // gt (greater than)
    // gte (greater than or equal to)
    // lt (less than)
    // lte (less than or equal to)
    // in 
    // nin (not in)
    
    // or
    // and

    // const courses = await Course.
    const courses = await Course
        
        // .find({author: 'Mosh', isPublished: true}) // results matching only
        // .find({price:{$gt: 10, $lt: 20}}) // price greater than 10 and less than 20
        // .find({price:{$in:[10,15,20]}}) // either 10, 15, or 20
        // .find().or([{authro:'Mosh'},{isPublished:true}]) // authored by mosh OR published
        // .find().and([{authro:'Mosh'},{isPublished:true}]) // authored by mosh AND published
        // .find({author: /^Mosh/}) // REGEX: author starting with Mosh
        .find() // all courses
        //.skip((pageNumber-1) * pageSize).limit(pageSize) // get docs on given page
        .limit(10) // first x
        .sort({name:1}) // 1 = ascend order | -1 = descending
        .select({name: 1, tags:1}) // only name and tags properties (+id)
        // .count()// returns the number of documents matching
    console.log(courses);
}

//getCourses();


async function updateCourse(id) {
    // https://www.mongodb.com/docs/manual/reference/operator/update/

    // update without retrieve
    const noRetrieveResult = await Course.updateOne({_id:id},{isPublished:false});
    console.log(noRetrieveResult);

    await Course.updateMany({author:/.*/},{ 
        $set:{author:'bob',isPublished:false}
    });  

    // retrieve then update
    const courseObject = await Course.findByIdAndUpdate(id,{  // returns course object
        $set:{author:'bob',isPublished:false}
    }, {new:true} ); // return document post-operation

    // retrieve then update - manual
    const course = await Course.findById(id)
    if (!course) return;
    if (course.isPublished) return; // use retrieve then update if checks needed

    course.isPublished = true;
    course.author = 'Another Author';
    // OR
    course.set({
        isPublished: true,
        author: 'Another Author'
    });

    const result = await course.save()
    // end retrieve then update
    console.log(result);
}

//updateCourse("62a43e33243efa72cb2bace4");

async function removeCourse(id){
    const resultOne = await Course.deleteOne({_id:id});
    const resultMany = await Course.deleteMany({_id:id});
    const course = await Course.findByIdAndRemove(id); // if none found, returns null
}

// removeCourse("62a43e33243efa72cb2bace4");

