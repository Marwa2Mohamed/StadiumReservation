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
        requiredPaths: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
        }
    },
    auth: {
        type: Boolean,
    }
});

module.exports = mongoose.model("users", users);