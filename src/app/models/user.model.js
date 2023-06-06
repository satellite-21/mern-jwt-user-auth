const mongoose = require('mongoose')

const User = mongoose.model(
    "User", 
    new mongoose.Schema({
        username: String, 
        email: String,
        password: String,
        // roles: [...]: It represents an array of roles associated with the user. Each role is represented by an ObjectId, 
        // which is a reference to the "Role" model. The type property is set to mongoose.Schema.Types.ObjectId to specify the data type, 
        // and the ref property is set to "Role" to indicate that the ObjectId references the "Role" model.
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role"
            }
        ]

    })
);

module.exports = User;

// After initializing Mongoose, we don’t need to write CRUD functions because Mongoose supports all of them:

// create a new User: object.save()
// find a User by id: User.findById(id)
// find User by email: User.findOne({ email: … })
// find User by username: User.findOne({ username: … })
// find all Roles which name in given roles array: Role.find({ name: { $in: roles } })
// These functions will be used in our Controllers and Middlewares.