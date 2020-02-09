/*
* 2020, Goorumlabs
* By Sky
*/

const express = require('express');
// DEFINE MODEL
const Tag = require('../models/tag');
const Log = require('../models/log');
const router = new express.Router();
const chalk = require('chalk');
const moment = require('moment')


// router.get('/', (req,res) => res.render('login',{

//   }))
    

router.get('/', (req,res) => res.render('landing',{

}))

router.get('/list', async(req,res) => {

    let totalAmount=0 , cashAmount=0 , cardAmount=0
    let DocumentCount=0

    // const _id = req.params.id
    try{
        
        let logObject = await Log.find({}).sort({timestamp: -1}).limit(10)
        documentCount = await Log.find({}).count()

        for(index in logObject){
           
            logObject[index].timestampFormat = moment(logObject[index].timestamp).format('YYYY.MM.DD HH:MM') 

            totalAmount += logObject[index].amount

            // console.log(chalk.blueBright( 'TotalAmount : ' + totalAmount + ' / logObjectAmount '+ logObject[index].amount))

            if(logObject[index].payment.type === 'cash'){
                logObject[index].payment.type = '현금';
                cashAmount+= logObject[index].amount
            }else if(logObject[index].payment.type === 'card'){
                logObject[index].payment.type = '카드'
                cardAmount+= logObject[index].amount

            }

            // console.log(chalk.bgRedBright( logObject[index].timestampFormat ))
            // console.log(chalk.greenBright( logObject[index].type ))

            
        }

        console.log(chalk.redBright(DocumentCount))

        console.log(chalk.blueBright(logObject))

        res.render('list', {
            documentCount,
            totalAmount,
            cashAmount,
            logObject : logObject
        })
    
    }catch(e){
        res.status(400)
    }
    
})

router.get('/list/:', async(req,res) => {
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