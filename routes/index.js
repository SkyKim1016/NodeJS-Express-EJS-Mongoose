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
const Account = require('../models/account');


router.get('/', (req,res) => res.render('landing',{

}))


router.get('/login', (req,res) => res.render('login',{

}));

router.post('/account/login', async(req, res) => { 
    try{
       //const id = req.body.id;
       // const account = await Account.findOne({ id })

       const account = await Account.findByCredentials(req.body.id, req.body.password)
       const token = await account.generateAuthToken()

        res.send({account, token})
    }catch(e){
        console.log(chalk.redBright(e))
    }
});

router.post('/accountReg', async (req,res) =>{
    const account = new Account (req.body)
    try{
        // account.forEach(update) => { account[update] = req.body[update] })
        await account.save()
        res.status(201).send(account)
    }catch(e){
        res.status(400).send(e)
    }
})


router.get('/list', async(req,res) => {

    let totalAmount=0 , cashAmount=0 , cardAmount=0
    let DocumentCount=0

    let dateNow = moment(Date.now()).format('YYYY.MM.DD HH:MM')

    let pageLimit = parseInt(req.query.pageLimit) || 10;

    try{
        
        //This is counting of record
        documentCount = await Log.find({}).countDocuments()

        // This is for cumulative calculating of total amount and cash and creditCard
        let totalAmountObject = await Log.find({}).sort({timestamp: -1})

  
        for(index in totalAmountObject){
            totalAmount += totalAmountObject[index].amount
    
                if(totalAmountObject[index].payment.type === 'cash' ){
                    cashAmount+= totalAmountObject[index].amount
                } 
                if(totalAmountObject[index].payment.type === 'creditCard'){
                    cardAmount+= totalAmountObject[index].amount
                }
        }

         // This is getting page datas 
        let logObject = await Log.find({}).sort({timestamp: -1}).limit(pageLimit)
        for(index in logObject){

            logObject[index].timestampFormat = moment(logObject[index].timestamp).format('YYYY/MM/DD HH:MM:SS') 
    
                if(logObject[index].payment.type === 'cash' ){
                    logObject[index].payment.type = '현금';
                } 
                if(logObject[index].payment.type === 'creditCard'){
                    logObject[index].payment.type = '신용카드'
                }
                if(logObject[index].payment.type === 'coupon'){
                    logObject[index].payment.type = '쿠폰'
                }
                if(logObject[index].payment.type === 'admin'){
                    logObject[index].payment.type = '관리자'
                } 
   
        }

        res.render('list', {
            documentCount,
            dateNow,
            totalAmount,
            cashAmount,
            cardAmount,
            logObject : logObject,
            pageLimit
        })

        // res.json({
        //     logObject
        // })
    
    }catch(e){
        console.log(e)
    }
    
})

router.get('/list/:dateCondition', async(req,res) => {
    // const _id = req.params.id

    try{
        const logObject = await Log.find({}).sort({timestamp: -1}).limit(10)


        // logDatas = JSON.stringify(logDocument)
        console.log(chalk.blueBright(logObject))

        res.render('list.ejs', {
            logObject : logObject
        })
    
    }catch(e){
        res.status(400)
    }
    
})

module.exports = router