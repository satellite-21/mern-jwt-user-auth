const mongoose = require('mongoose')
// mongoose model named role
const Role = mongoose.model(
    "Role", 
    new mongoose.Schema({
        name: String
    })
);

// this line exports the "Role" model so that it can be imported and used in other parts of application
module.exports = Role;