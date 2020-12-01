const mongoose = require('mongoose');
const main_user_model = require("./main_users_model")
const Schema = mongoose.Schema;
const owner = main_user_model.discriminator('Owner',new Schema({
    auth: { type: Boolean , required:true},
    playgrounds : [{ type: Schema.Types.ObjectId, ref: 'Playgrounds' }]
}))

module.exports = mongoose.model("Owner",owner.schema);
