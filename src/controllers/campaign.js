const moment = require('moment')

const compaignModel = require('../models/campaign');


exports.add = async(req, res) => {
    try {
        await compaignModel.insertMany([
        {
            "name": "campaign 1",
            "start_date": "01/01/2024",
            "end_date": "01/01/2024",
            "influencer_id": "668ad125c551e8f00f81578c",
            "investment": 15000
        },
        {
            "name": "campaign 2",
            "start_date": "02/01/2024",
            "end_date": "04/01/2024",
            "influencer_id": "668ad139c551e8f00f81578e",
            "investment": 12000
        },
        {
            "name": "campaign 3",
            "start_date": "07/01/2024",
            "end_date": "08/01/2024",
            "influencer_id": "668ad139c551e8f00f81578e",
            "investment": 25000
        }
    ])
        .then(() => {
            return res.send({
                status: true,
                statuscode: 201, 
                message: 'compaign added successfully.'
            })
        })
        .catch((err) => {
            return res.send({
                status: false,
                statuscode: 422, 
                message: 'error, compaign not added successfully.'
            })
        })
    } catch (error) {
        return res.send({
            status: false,
            statuscode: 500,
            message: 'Something went wrong!'
           })
    }
}
