const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const playgrounds = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    playground_name: {
        type: String,
        required: true
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
    // location: {
    //     type: {
    //       type: String, 
    //       enum: ['Point'],
    //       required: true
    //     },
    //     coordinates: {
    //       type: [Number],
    //       required: true
    //     }
    //   },
    image: { type: String, required: true }

});

module.exports = mongoose.model("Playgrounds", playgrounds);