const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const workingDays = new Schema({
    dayName: {
        type: String,
        required: true
    },

    start_time: {
        type: Date,
        required: true
    },
    end_time: {
        type: Date,
        required: true
    },
    hourPriceAM: {
        type: Number,
        required: true
    },
    hourPricePM: {
        type: Number,
        required: true
    }
});
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
    weekDays:{
        type:[workingDays],
        required:true
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
    address:{
      type: String,
      required: true
    },
    capacity: {
        type: String,
        required: true
    },

    image: { 
        type: String, 
        required: true 
    },

    avaiable: {
        type: Boolean,
        required: true
    }

});

module.exports = mongoose.model("Playgrounds", playgrounds);