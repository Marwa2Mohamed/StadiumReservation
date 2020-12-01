const mongoose = require('mongoose');
const main_user_model = require("./main_users_model")
const Schema = mongoose.Schema;
const player = main_user_model.discriminator('Player',new Schema({
    actions: { type: Boolean },
}))

module.exports = mongoose.model("Player" , player.schema);
