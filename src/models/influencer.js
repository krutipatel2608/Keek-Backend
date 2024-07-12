const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const influencerModel = new Schema({
    name: String,
    // payment: Number,
    // date: Date,
    // content_status: 
    // payment_status: 
    post_link: Array,
    views: Number,
    rate_per_post: Number
})

module.exports = mongoose.model('influencer', influencerModel);