const inflencerModel = require('../models/influencer');


exports.add = async(req, res) => {
    try {
        await inflencerModel.create(req.body)
        .then(() => {
            return res.send({
                status: true,
                statuscode: 201, 
                message: 'Influencer added successfully.'
            })
        })
        .catch((err) => {
            return res.send({
                status: false,
                statuscode: 422, 
                message: 'error, Influencer not added successfully.'
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