const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const returnModel = new Schema({
    current_date: String,
    campaign_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'campaign'
    },
    influencer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'influencer'
    },
    sales: Number
})

module.exports = mongoose.model('return', returnModel);