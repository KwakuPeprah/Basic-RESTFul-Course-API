const Joi = require('joi'); //load the Joi module
const express = require('express'); //load the express module
const app = express(); //create an express application

app.use(express.json());//this is a piece of middleware that will parse the body of the request, if there is a JSON object in the body of the request, it will parse the body of the request and then set req.body property


//DEFINE AN ARRAY OF COURSES
const courses = [
    { id: 1, name: ' Software Engineering'},
    { id: 2, name: ' Systems Engineering'},
    { id: 3, name: 'Graphic desigining'}
]

//GETTING STARTED WITH EXPRESS

//HTTP GET REQUESTS 
//GET we define new routes with app.get

app.get('/', (req, res) => {
    res.send('Hello World!!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

//route to get a single course from the courses array
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));//find the course with the given id

    if (!course)  return res.status(404).send('The course with the given ID was not found');//IF WE DONT FIND THE COURSE WITH THE GIVEN ID, WE RETURN A RESPONSE WITH A STATUS CODE; 404 NOT FOUND

    res.send(course);//IF WE FIND THE COURSE WITH THE GIVEN ID, WE RETURN THE COURSE
});


//RESPONDING TO HTTP POST REQUESTS
app.post('/api/courses', (req, res) => {

    //Validate
    const {error} = validateCourse(req.body);
    if (error) 
        return res.status(400).send(result.error.details[0].message);
            
    //CREATING A NEW COURSE
    const course = {
        id: courses.length + 1,// because we are not using a database, we need manually generate an id for the new course

        name: req.body.name //we assume that the client will send the name of the course in the body of the request
    };
    courses.push(course);//add the new course to the courses array
    res.send(course);//return the new course to the client
});



//RESPONDING TO HTTP PUT REQUESTS
app.put('/api/courses/:id', (req, res) => {

    //Look up the course
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course)  return res.status(404).send('The course with the given ID was not found');

    //Validate
    const {error} = validateCourse(req.body);
    if (error) return  res.status(400).send(result.error.details[0].message);
       
    
    //when everything is good update the course
    course.name = req.body.name;
    //Return the updated course
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {

    //Look up the course
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found');
    
    //delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(course); 
})


//VALIDATION FUNCTION
function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    }
    
    return Joi.validate(course, schema);
}




//The port environment variable is important because when we deploy our application to a hosting provider like Heroku, they will set the port for us. So we should not hardcode the port number in our application.

//3000 is just an arbitrary number. You can set it to any number you want. But it should be a number that is not used by other applications on your machine.
const port = process.env.PORT || 3000; //
//listen on port
app.listen(port, () => console.log(`listening on port ${port}...`));