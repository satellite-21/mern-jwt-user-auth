const  express = require('express');
// CORS stands for Cross-Origin Resource Sharing. 
// It is a mechanism that allows web browsers to make requests to a different domain than the one the current page originated from. 
// It is a security feature implemented by browsers to prevent cross-site scripting (XSS) attacks.
// The code you provided is configuring CORS middleware in an Express.js application. 
// The cors package is used to enable Cross-Origin Resource Sharing for the routes in your application.
const cors = require('cors');
const app = express();
// The corsOptions object is defining the CORS configuration options. 
// In this example, you are specifying that requests from "http://localhost:8081" are allowed to access your server's resources. 
// This is the origin property, which represents the allowed origins or domain names.
var corsOptions = {
    origin: "http://localhost:8081"
};
// The app.use() function adds the CORS middleware to your Express application. 
// It enables CORS for all routes in your application using the provided corsOptions. 
// By calling cors(corsOptions), you are configuring CORS to allow requests from the specified origin (http://localhost:8081).
app.use(cors(corsOptions));


const db = require('./app/models');
const dbConfig = require('./app/config/db.config');
const { count } = require('./app/models/role.model');
const Role = db.role;

db.mongoose
    .connect(`mongodb+srv://satellite_21:3uCWwwf8K49dvq3B@satellite.cfn4pz0.mongodb.net/?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connected with MongoDB!");
        initial();
    })
    .catch(err => {
        console.error("Connection Error", err);
        process.exit();
    });

// When a client sends a request with the "Content-Type" header set to "application/json", 
// the request body typically contains data in JSON format. The express.json() 
// middleware is responsible for parsing and extracting this JSON data from the request body.
app.use(express.json());

// When a client submits a form with a POST request and the form has its enctype attribute set to "application/x-www-form-urlencoded"
// , the data is encoded in the URL format. The express.urlencoded() middleware is responsible for parsing and extracting 
// this URL-encoded data from the request body.

app.use(express.urlencoded({ extended:  true }));

//defining a route 
app.get("/", (req, res) => {
    res.json({message: "Welcome to this Application"});
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

//set port and listen for the requests from port 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is Running on Port ${PORT}`);
});




// // adding three roles 

// function initial() {
//     Role.estimatedDocumentCount((err, count) => {
//       if (!err && count === 0) {
//         new Role({
//           name: "user"
//         }).save(err => {
//           if (err) {
//             console.log("error", err);
//           }
  
//           console.log("added 'user' to roles collection");
//         });
  
//         new Role({
//           name: "moderator"
//         }).save(err => {
//           if (err) {
//             console.log("error", err);
//           }
  
//           console.log("added 'moderator' to roles collection");
//         });
  
//         new Role({
//           name: "admin"
//         }).save(err => {
//           if (err) {
//             console.log("error", err);
//           }
  
//           console.log("added 'admin' to roles collection");
//         });
//       }
//     });
//   }
async function initial() {
    try {
      const count = await Role.estimatedDocumentCount();
      if (count === 0) {
        await Promise.all([
          new Role({ name: "user" }).save(),
          new Role({ name: "moderator" }).save(),
          new Role({ name: "admin" }).save()
        ]);
        console.log("Roles added successfully!");
      }
    } catch (error) {
      console.log("Error occurred while adding roles:", error);
    }
  }
  