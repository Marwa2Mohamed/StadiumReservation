const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const stadiumStaff = new Schema({
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
    join_Date:{
        type: Date,
        required: true
    },
    privilege:[{
        type: String,
        require:true
    }]
});

module.exports = mongoose.model("stadiumstaff",stadiumStaff);