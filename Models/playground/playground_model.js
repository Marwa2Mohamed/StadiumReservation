const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const playgrounds = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    playground_name: {
        type: String,
        required: [true ,'Please add a playground_name']
    },
    owner_Id:{
        type:Schema.Types.ObjectId,
        ref : 'Owner'
    },
    description: {
        type: String,
    },
    start_time: {
        type: Date,
        
    },
    end_time: {
        type: Date,
    },
    location: {
      
        type: {
          type: String, 
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number],
         index: '2dsphere'
        }
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    address:{
        type:String,
        required:true
    },
    image: { type: String},
});
module.exports = mongoose.model("Playgrounds", playgrounds);