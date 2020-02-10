/*
* 2020, Goorumlabs
* By Sky
*/

const express = require('express');
const router = new express.Router();
const chalk = require('chalk');
const moment = require('moment')

// DEFINE MODEL
const Tag = require('../models/tag');
const Log = require('../models/log');


router.get('/', (req,res) => res.render('landing',{

}))

router.get('/list', async(req,res) => {

    let totalAmount=0 , cashAmount=0 , cardAmount=0
    let DocumentCount=0

    let dateNow = moment(Date.now()).format('YYYY.MM.DD HH:MM')

    // const _id = req.params.id
    try{
        
        let logObject = await Log.find({}).sort({timestamp: -1}).limit(10)
        documentCount = await Log.find({}).countDocuments()

        for(index in logObject){
           
            logObject[index].timestampFormat = moment(logObject[index].timestamp).format('YYYY.MM.DD HH:MM') 

            totalAmount += logObject[index].amount


            if(logObject[index].payment.type === 'cash'){
                logObject[index].payment.type = '현금';
                cashAmount+= logObject[index].amount

            }else if(logObject[index].payment.type === 'card'){
                logObject[index].payment.type = '카드'
                cardAmount+= logObject[index].amount

            }
            
        }

        res.render('list', {
            documentCount,
            dateNow,
            totalAmount,
            cashAmount,
            cardAmount,
            logObject : logObject
        })
    
    }catch(e){
        res.status(400)
    }
    
})

router.get('/list/:dateCondition', async(req,res) => {
    // const _id = req.params.id

    try{
        const logObject = await Log.find({}).sort({timestamp: -1}).limit(10)


        // logDatas = JSON.stringify(logDocument)
        console.log(chalk.blueBright(logObject))

        res.render('list', {
            logObject : logObject
        

        })
    
    }catch(e){
        res.status(400)
    }
    
})

module.exports = router