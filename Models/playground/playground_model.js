const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const workingDays = new Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        dayName: {
            type: String,
            required: true
        },
        start_time: {
            type: Date, // just the HH:mm part
            required: true
        },
        end_time: {
            type: Date, // just the HH:mm part
            required: true
        },
        hourPriceAM: {
            type: Number,
            default: 0
        },
        hourPricePM: {
            type: Number,
            default: 0
        }
    });
const playgrounds = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    playground_name: {
        type: String,
        required: [true ,'Please add a playground_name']
    },
    owner_Id: {
        type: Schema.Types.ObjectId,
        ref: 'Owner'
    },
    description: {
        type: String,

    },
    weekDays: {
        type: [workingDays],
        required: true
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
    address: {
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