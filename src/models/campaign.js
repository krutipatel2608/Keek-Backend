const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campaignModel = new Schema({
    name: String,
    start_date: String,
    end_date: String,
    influencer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'influencer'
    },
    investment: Number,
    sales: Number
})

module.exports = mongoose.model('campaign', campaignModel);