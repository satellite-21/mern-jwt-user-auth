
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

  
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