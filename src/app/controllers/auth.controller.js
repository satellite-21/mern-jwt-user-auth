// // Controller for Authentication
// // 2 main functions for Authentication:
// // - signup: create new User in database (role is user if not specifying role)
// // - signin:

// // find username of the request in database, if it exists
// // compare password with password in database using bcrypt, if it is correct
// // generate a token using jsonwebtoken
// // return user information & access Token

// const config = require("../config/auth.config");
// const db = require("../models");
// const User  = db.user;
// const Role = db.role;

// var jwt = require('jsonwebtoken');
// var bcrypt = require("bcryptjs");

// exports.signup = (req, res) => {
//     const user = new User({
//         username: req.body.username,
//         email: req.body.email,
//         password: bcrypt.hashSync(req.body.password, 8)
//     });


//     user.save((err, user) => {
//         if(err) {
//             res.status(400).send({
//                 message: err
//             })
//             return;
//         } 

//         if(req.body.roles) {
//             Role.find(
//                 {
//                     name: { $in: req.body.roles }
//                 },
//                 (err, roles ) => {
//                     if(err) {
//                         res.status(500).send({message: err});
//                         return;
//                     }

//                     user.roles  = roles.map(role=>role._id);
//                     user.save(err => {
//                         if(err){
//                             res.status(500).send({message: err});
//                             return;
//                         }
//                         res.send({message: "User Registered Successfully!"});
//                     });
//                 }
//             );
//         } else{
//             Role.findOne({name: "user" },  (err, role) => {
//                 if(err) {
//                     res.status(500).send({message: err});
//                     return;
//                 }
//                 user.roles = [role._id];
//                 user.save(err => {
//                     if(err) {
//                         res.send({message: err});
//                         return;
//                     }
//                     res.send({message: "User Registered Successfully!"});
//                 });
//             });
//         }
           
//     });

// };

// exports.signin = (req, res) => {
//     User.findOne({
//         username: req.body.username
//     })

//     .populate("roles", "-__v")
//     .exec((err, user) => {
//         if (err){
//             res.status(500).send({message: err});
//             return;
//         }

//         if(!user){
//             return res.status(404).send({message: "user not found!"});
//         }

//         var passwordIsValid = bcrypt.compareSync(
//             req.body.password, 
//             user.password
//         );

//         if(!passwordIsValid){
//             return res.status(401).send({
//                 accessToken: null, 
//                 messgae: "Invalid password!"
//             });
//         }

//         var token  = jwt.sign({id: user.id}, config.secret, {
//             expiresIn: 86400
//         });

//         var authorities = [];

//         for(let i = 0; i<user.roles.length; i++){
//             authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
//         }
//         res.status(200).send({
//             id: user._id, 
//             username: user.username,
//             email: user.email, 
//             roles: authorities, 
//             accessToken: token
//         });

//     });
    
// };


const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// exports.signup = async (req, res) => {
//   try {
//     const { username, email, password, roles } = req.body;

//     // Check if the email is already registered
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).send({ message: "Failed! Email is already in use!" });
//     }

//     // Hash the password
//     const hashedPassword = bcrypt.hashSync(password, 8);

//     // Create a new user
//     const user = new User({
//       username,
//       email,
//       password: hashedPassword
//     });

//     // Set roles for the user
//     if (roles) {
//       const foundRoles = await Role.find({ name: { $in: roles } });
//       user.roles = foundRoles.map(role => role._id);
//     } else {
//       const defaultRole = await Role.findOne({ name: "user" });
//       user.roles = [defaultRole._id];
//     }

//     // Save the user to the database
//     await user.save();

//     res.send({ message: "User Registered Successfully!" });
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// };

// exports.signup = async (req, res) => {
//     try {
//       const { username, email, password, roles } = req.body;
  
//       // Check if the email is already registered
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         return res.status(400).send({ message: "Failed! Email is already in use!" });
//       }
  
//       // Hash the password
//       const hashedPassword = await bcrypt.hash(password, 8);
  
//       // Create a new user
//       const user = new User({
//         username,
//         email,
//         password: hashedPassword
//       });
  
//       // Set roles for the user
//       if (roles) {
//         const foundRoles = await Role.find({ name: { $in: roles } });
//         user.roles = foundRoles.map(role => role._id);
//       } else {
//         const defaultRole = await Role.findOne({ name: "user" });
//         user.roles = [defaultRole._id];
//       }
  
//       // Save the user to the database
//       await user.save();
  
//       res.send({ message: "User Registered Successfully!" });
//     } catch (error) {
//       res.status(500).send({ message: error.message });
//     }
//   };
  
exports.signup = async (req, res) => {
    try {
      const { username, email, password, roles } = req.body;
        
      console.log("Request body:", req.body);

      // Check if the email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).send({ message: "Failed! Email is already in use!" });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 8);
      
      console.log("Hashed Passoword: ", hashedPassword);
      // Create a new user
      const user = new User({
        username,
        email,
        password: hashedPassword
      });
  
      // Set roles for the user
      if (roles && roles.length > 0) {
        const foundRoles = await Role.find({ name: { $in: roles } });
        if (foundRoles.length !== roles.length) {
          return res.status(400).send({ message: "Failed! Some roles do not exist!" });
        }
        user.roles = foundRoles.map(role => role._id);
      } else {
        const defaultRole = await Role.findOne({ name: "user" });
        user.roles = [defaultRole._id];
      }
  
      // Save the user to the database
      await user.save();
  
      res.send({ message: "User Registered Successfully!" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
  

exports.signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username }).populate("roles", "-__v");

    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }

    // Compare the password
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({ accessToken: null, message: "Invalid password!" });
    }

    // Generate access token
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400 // 24 hours
    });

    // Get user roles
    const authorities = user.roles.map(role => "ROLE_" + role.name.toUpperCase());

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};