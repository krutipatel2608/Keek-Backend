const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userModel = new Schema({
    name: String,
    email: String,
    password: String,
    confirm_password: String,
    phone: Number,
    isverified: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('user', userModel);