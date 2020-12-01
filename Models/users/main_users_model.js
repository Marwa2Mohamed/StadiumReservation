const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const users = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    first_name: {
        type: String,
        required: true
    },
    second_name: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        requiredPaths: true,
        
    },
    type_of_user:{
        type:Number,//1 => player ,  2 => owner
    }

}, {
    discriminatorKey: 'user_type', 
});

module.exports = mongoose.model("Users", users);