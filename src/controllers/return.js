const moment = require('moment')
const returnModel = require('../models/daily_return');
const campaignModel = require('../models/campaign');

exports.add = async(req, res) => {
    try {
        // req.body.current_date = moment(req.body.current_date).format('DD/MM/YYYY');        
        await returnModel.insertMany([
            {
                "campaign_id": "668b8d96c026ad903c597c2e",
                "influencer_id": "668ad125c551e8f00f81578c",
                "sales": 14000,
                "current_date": "01/07/2024" 
            },
            {
                "campaign_id": "668b8d96c026ad903c597c2f",
                "influencer_id": "668ad139c551e8f00f81578e",
                "sales": 13000,
                "current_date": "02/07/2024" 
            },
            {
                "campaign_id": "668b8d96c026ad903c597c2f",
                "influencer_id": "668ad139c551e8f00f81578e",
                "sales": 5000,
                "current_date": "03/07/2024" 
            },
            {
                "campaign_id": "668b8d96c026ad903c597c2f",
                "influencer_id": "668ad139c551e8f00f81578e",
                "sales": 2000,
                "current_date": "04/07/2024" 
            },
            {
                "campaign_id": "668b8d96c026ad903c597c30",
                "influencer_id": "668ad139c551e8f00f81578e",
                "sales": 10000,
                "current_date": "07/07/2024" 
            },
            {
                "campaign_id": "668b8d96c026ad903c597c30",
                "influencer_id": "668ad139c551e8f00f81578e",
                "sales": 2000,
                "current_date": "08/07/2024" 
            }
        ])
        .then(() => {
            return res.send({
                status: true,
                statuscode: 201, 
                message: 'return added successfully.'
            })
        })
        .catch((err) => {
           
            return res.send({
                status: false,
                statuscode: 422, 
                message: 'error, return not added successfully.'
            })
        })
    } catch (error) {
        console.log(error, ' -- error log 24 ---');
        return res.send({
            status: false,
            statuscode: 500,
            message: 'Something went wrong!'
           })
    }
}

exports.currentDayReturn = async(req, res) => {
    try {
        let todaysSale = 0;
        const findCurrentDayRecord = await returnModel.find({'current_date': '08/07/2024'});
        findCurrentDayRecord.forEach((todaysReturn) => {
            todaysSale += todaysReturn.sales
        })
        return res.send({
            status: true,
            statuscode: 200,
            message: 'List found',
            data: todaysSale
        })
    } catch (error) {
        return res.send({
            status: false,
            statuscode: 500,
            message: 'Something went wrong!'
           })
    }
}

exports.monthlyROI = async(req, res) => {
    try {
        console.log(req.query.start_date, ' ---start date 94 ----');
        console.log(req.query.end_date, ' ---end  date 94 ----');
        const month = req.query.month;
        let totalInvestment = 0;
        let totalReturn = 0;
        const findReturnData = await returnModel.find({
            current_date: {$gte: req.query.start_date},
            current_date:  {$lte: req.query.end_date}
        })

        const findInvestment = await campaignModel.find({
            start_date: {$gte: req.query.start_date},
            end_date: {$lte: req.query.end_date}
        })
        // console.log(findInvestment, ' ---- findInvestment 109 -----');
        findReturnData.forEach((returnsData) => {
            totalReturn += returnsData.sales
        }) 
        findInvestment.forEach((investment) => {
            totalInvestment += investment.investment
        })
        const roi = totalReturn / totalInvestment * 100;
        return res.send({
            status: true,
            statuscode:200,
            message: 'List found',
            data: {
                totalInvestment : totalInvestment,
                totalReturn: totalReturn,
                ROI : roi
            }
        })
    } catch (error) {
        console.log(error, ' -- error log 24 ---');
        return res.send({
            status: false,
            statuscode: 500,
            message: 'Something went wrong!'
           })
    }
}