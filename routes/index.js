/*
* 2020, Goorumlabs
* By Sky
*/

const express = require('express');
const router = new express.Router();
const chalk = require('chalk');
const moment = require('moment');

// DEFINE MODEL
const Tag = require('../models/tag');
const Log = require('../models/log');

let session = require('express-session');
const auth = require('../middleware/auth');

// const Account = require('../models/account');
// Custmized middleware for JWT token



router.get('/', ( req,res) => res.render('landing',{
    
}))



router.get('/login', (req,res) => {
    let reqSession = req.session;
    
    if(reqSession.loginCheck === 'true'){
        res.redirect('/saleList')
    }else{
        res.render('login',{})
    }
    
});

router.post('/api/login', (req,res) => {

    let reqSession = req.session;
    let id = req.body.id
    let password = req.body.password

    //console.log(chalk.greenBright('req_session : '+ req.req_session + " / id : " + req.params.id + " / password : " + req.params.password))
    
    if(id == 'admin'){

        if(password == '1234'){
            reqSession.name = 'GS칼텍스 시화점',
            reqSession.loginCheck = 'true',

            res.send({
                status:'200',
                reqSession : reqSession.id
            })
        }
    }
    
});

router.get('/api/logout', function(req, res){
    reqSession = req.session;
    if(reqSession.name){
        req.session.destroy(function(err){
            if(err){
                console.error(err);
            }else{
                res.redirect('/');
            }
        })
    }else{
        res.redirect('/');
    }
})

// router.get('/login/me', auth, async (req,res) => {
//     res.send(req.account)
//  })

// router.post('/account/reg', async (req,res) =>{
//     const account = new Account (req.body)
//     try{
//         // account.forEach(update) => { account[update] = req.body[update] })
//         await account.save()
//         res.status(201).send(account)
//     }catch(e){
//         res.status(400).send(e)
//     }
// })

// router.post('/account/login', async(req, res) => { 
//     try{
//        //const id = req.body.id;
//        // const account = await Account.findOne({ id })

//        const account = await Account.findByCredentials(req.body.id, req.body.password)
//        const token = await account.generateAuthToken()

//         res.send({account, token})
//     }catch(e){
//         console.log(chalk.redBright(e))
//     }
// });

// router.post('/account/logout', auth, async (req,res) => {
//     try{

//         //@ LogoutAll
//         //req.account.tokens = []
//         // await req.account.save()
//         // res.send()
        
//         req.account.tokens = req.account.tokens.filter( (token) => {
//             return token.token !== req.token 
//         })
//         await req.account.save()
//         res.send()


//     }catch(e){
//         console.error(e)
//     }
// });


//@  saleListPage
router.get('/saleList',auth, async(req,res) => {

    let reqSessionName = req.session.name

    let totalAmount=0 , cashAmount=0 , cardAmount=0
    let documentCount=0 , tempRowNumber=0

    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let reqStartDateCalendar = req.query.startDateCalendar;
    let reqEndDateCalendar = req.query.endDateCalendar

    let dateNow = moment(Date.now()).format('MM/DD/YYYY')
    // moment.locale('KO');  

    let queryStartDate, queryEndDate;

    // let match={}
    // if(req.query.requestDate){
    //     match.timestamp = req.query.requestDate === 'true'
    // }

    try{
        
        //@ [1] This is date setting which recieved calendar date from view page 
        if(reqStartDateCalendar === '' || typeof reqStartDateCalendar === 'undefined' ){
            queryStartDate = '01/01/2020'
        }else{
            queryStartDate = moment(reqStartDateCalendar).utcOffset('+0700')
            queryStartDate = queryStartDate
        }
    
        if(reqEndDateCalendar === '' || typeof reqEndDateCalendar === 'undefined' ){
            queryEndDate = '12/12/2020'
        }else{
            queryEndDate = moment(reqEndDateCalendar).utcOffset('+0700')
            queryEndDate = queryEndDate.add(1,'day')
        }

        //@ [2] First Query 
        //This is counting of record
        documentCount = await Log.find({ timestamp : {$gte : queryStartDate ,  $lte : queryEndDate } }).countDocuments()

        
        //@ [3] Second Query
        // This is for cumulative calculating of total amount and cash and creditCard
        //let totalAmountObject = await Log.find({}).sort({timestamp: -1})
        let totalAmountObject = await Log.find({ timestamp : {$gte : queryStartDate ,  $lte : queryEndDate }  }).sort({timestamp: -1})  
        for(index in totalAmountObject){
            totalAmount += totalAmountObject[index].amount
            
            // console.log(chalk.redBright('['+index+']payment.type  : ' + totalAmountObject[index].payment.type))

                if(totalAmountObject[index].payment.type === 'cash' || typeof (totalAmountObject[index].payment.type) === 'undefined' ){
                    cashAmount += totalAmountObject[index].amount
                } 
                if(totalAmountObject[index].payment.type === 'creditCard'){
                    cardAmount += totalAmountObject[index].amount
                }
        }


         //@ [4] Third Query
        // This is getting page datas 
        let logObject = await Log.find({ timestamp : {$gte : queryStartDate ,  $lte : queryEndDate } }).sort({timestamp: -1}).limit(pageLimit)
        for(index in logObject){
            
           

            //if(logObject[index].rowNumber == undefined || logObject[index].rowNumber === null || logObject[index].rowNumber == '' )
            if(tempRowNumber == 0 ){
                tempRowNumber = documentCount
            }
            logObject[index].rowNumber = tempRowNumber
            tempRowNumber =  tempRowNumber -1
            


            logObject[index].timestampFormat = moment(logObject[index].timestamp).format('YYYY/MM/DD hh:mm:ss') 

                if( logObject[index].method === 'depositByUid'){
                    logObject[index].method = '충전';
                }else{
                    logObject[index].method = '신규';
                }

                if(logObject[index].payment.type === undefined || logObject[index].payment.type === null || logObject[index].payment.type === ''  ){
                    logObject[index].payment.type = '없음';
                } 
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
        // console.log(chalk.greenBright('LogObject[] : '+logObject))
        // console.log(chalk.greenBright('queryStartDate : '+ queryStartDate))
        // console.log(chalk.greenBright('queryEndDate : '+ queryEndDate))

         //@ This is rendering that variables into view page 
        res.render('saleList', {
            reqSessionName,
            reqStartDateCalendar,
            reqEndDateCalendar ,
            documentCount,
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
        // res.render('error')
    }
    
})


//@  saleListDaily
router.get('/saleListDaily', auth, async(req,res) => {

    let reqSessionName = req.session.name

    let totalAmount=0 , cashAmount=0 , cardAmount=0
    let documentCount=0 , tempRowNumber=0

    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let reqStartDateCalendar = req.query.startDateCalendar;
    let reqEndDateCalendar = req.query.endDateCalendar

    let dateNow = moment(Date.now()).format('MM/DD/YYYY')

    let queryStartDate, queryEndDate;

    // let match={}
    // if(req.query.requestDate){
    //     match.timestamp = req.query.requestDate === 'true'
    // }

    try{
        
        //@ [1] This is date setting which recieved calendar date from view page 
        //This is counting of record
        if(reqStartDateCalendar === '' || typeof reqStartDateCalendar === 'undefined' ){
            queryStartDate = '01/01/2020'
        }else{
            queryStartDate = moment(reqStartDateCalendar).utcOffset('+0700')
            queryStartDate = queryStartDate
        }
    
        if(reqEndDateCalendar === '' || typeof reqEndDateCalendar === 'undefined' ){
            queryEndDate = '12/12/2020'
        }else{
            queryEndDate = moment(reqEndDateCalendar).utcOffset('+0700')
            queryEndDate = queryEndDate.add(1,'day')
        }


        //@ [2] First Query 
        //This is counting of record
        documentCount = await Log.find({ timestamp : {$gte : queryStartDate ,  $lte : queryEndDate } }).countDocuments()

        
        //@ [3] Second Query
        // This is for cumulative calculating of total amount and cash and creditCard
        //let totalAmountObject = await Log.find({}).sort({timestamp: -1})
        let totalAmountObject = await Log.find({ timestamp : {$gte : queryStartDate ,  $lte : queryEndDate }  }).sort({timestamp: -1})  
        for(index in totalAmountObject){
            totalAmount += totalAmountObject[index].amount
    
                if(totalAmountObject[index].payment.type === 'cash' || typeof (totalAmountObject[index].payment.type) === 'undefined'){
                    cashAmount += totalAmountObject[index].amount
                } 
                if(totalAmountObject[index].payment.type === 'creditCard'){
                    cardAmount += totalAmountObject[index].amount
                }
        }


         //@ [4] Third Query
        // This is getting page datas 
        let logObject = await Log.find({ timestamp : {$gte : queryStartDate ,  $lte : queryEndDate } }).sort({timestamp: -1}).limit(pageLimit)
        for(index in logObject){

            //if(logObject[index].rowNumber == undefined || logObject[index].rowNumber === null || logObject[index].rowNumber == '' )
            if(tempRowNumber == 0 ){
                tempRowNumber = documentCount
            }
            logObject[index].rowNumber = tempRowNumber
            tempRowNumber =  tempRowNumber -1
            


            logObject[index].timestampFormat = moment(logObject[index].timestamp).format('YYYY/MM/DD hh:mm:ss') 

                if(logObject[index].payment.type === undefined || logObject[index].payment.type === null || logObject[index].payment.type === ''  ){
                    logObject[index].payment.type = '없음';
                } 
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

        // console.log(chalk.greenBright('queryStartDate : '+ queryStartDate))
        // console.log(chalk.greenBright('queryEndDate : '+ queryEndDate))
        
        // let dateNow = moment("2020-02-10").format('MM/DD/YYYY')

        // let dailyTotalObject = await Log.aggregate([
        //     {   $match: {
        //             "payment.type" :"CreditCard"
        //         } ,
        //         $group: { 
        //             _id: { day: { $dayOfWeek:"$timestamp" } },
        //             amount:{$sum:"$amount"}  
        //         }
        //     }
        // ])

        // let dailyTotalObject = await Log.aggregate([
        //     {
        //         $group:{
        //             _id: { day: { $dayOfWeek:"$timestamp" } },
        //             amount:{$sum:"$amount"} 
        //         },
        //         $group:{
        //             _id: { day: { $dayOfWeek:"$timestamp" } },
        //             cash:{
        //                 $match:{
        //                     "payment":{
        //                         "type":"cash"
        //                     }
        //                 }
        //             } 
        //         },
        //     }
        // ])
        
        // console.log(chalk.blueBright('** dailyTotalObject **' + JSON.stringify(dailyTotalObject)))

         //@ This is rendering that variables into view page 
        res.render('saleListDaily', {
            reqSessionName,
            reqStartDateCalendar,
            reqEndDateCalendar ,
            documentCount,
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
        // res.render('error')
    }
    
})


router.get('/saleListMonthly', auth, async(req,res) => {

    let reqSessionName = req.session.name

    let totalAmount=0 , cashAmount=0 , cardAmount=0
    let documentCount=0 , tempRowNumber=0

    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let reqStartDateCalendar = req.query.startDateCalendar;
    let reqEndDateCalendar = req.query.endDateCalendar

    let dateNow = moment(Date.now()).format('MM/DD/YYYY')

    let queryStartDate, queryEndDate;

    // let match={}
    // if(req.query.requestDate){
    //     match.timestamp = req.query.requestDate === 'true'
    // }

    try{
        
        //@ [1] This is date setting which recieved calendar date from view page 
        //This is counting of record
        if(reqStartDateCalendar === '' || typeof reqStartDateCalendar === 'undefined' ){
            queryStartDate = '01/01/2020'
        }else{
            queryStartDate = moment(reqStartDateCalendar).utcOffset('+0700')
            queryStartDate = queryStartDate
        }
    
        if(reqEndDateCalendar === '' || typeof reqEndDateCalendar === 'undefined' ){
            queryEndDate = '12/12/2020'
        }else{
            queryEndDate = moment(reqEndDateCalendar).utcOffset('+0700')
            queryEndDate = queryEndDate.add(1,'day')
        }


        //@ [2] First Query 
        //This is counting of record
        documentCount = await Log.find({ timestamp : {$gte : queryStartDate ,  $lte : queryEndDate } }).countDocuments()

        
        //@ [3] Second Query
        // This is for cumulative calculating of total amount and cash and creditCard
        //let totalAmountObject = await Log.find({}).sort({timestamp: -1})
        let totalAmountObject = await Log.find({ timestamp : {$gte : queryStartDate ,  $lte : queryEndDate }  }).sort({timestamp: -1})  
        for(index in totalAmountObject){
            totalAmount += totalAmountObject[index].amount
    
                if(totalAmountObject[index].payment.type === 'cash' || typeof (totalAmountObject[index].payment.type) === 'undefined'){
                    cashAmount += totalAmountObject[index].amount
                } 
                if(totalAmountObject[index].payment.type === 'creditCard'){
                    cardAmount += totalAmountObject[index].amount
                }
        }


         //@ [4] Third Query
        // This is getting page datas 
        let logObject = await Log.find({ timestamp : {$gte : queryStartDate ,  $lte : queryEndDate } }).sort({timestamp: -1}).limit(pageLimit)
        for(index in logObject){

            //if(logObject[index].rowNumber == undefined || logObject[index].rowNumber === null || logObject[index].rowNumber == '' )
            if(tempRowNumber == 0 ){
                tempRowNumber = documentCount
            }
            logObject[index].rowNumber = tempRowNumber
            tempRowNumber =  tempRowNumber -1
            


            logObject[index].timestampFormat = moment(logObject[index].timestamp).format('YYYY/MM/DD hh:mm:ss') 

             

                if(logObject[index].payment.type === undefined || logObject[index].payment.type === null || logObject[index].payment.type === ''  ){
                    logObject[index].payment.type = '없음';
                } 
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

        // console.log(chalk.greenBright('queryStartDate : '+ queryStartDate))
        // console.log(chalk.greenBright('queryEndDate : '+ queryEndDate))

         //@ This is rendering that variables into view page 
        res.render('saleListMonthly', {
            reqSessionName,
            reqStartDateCalendar,
            reqEndDateCalendar ,
            documentCount,
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
        // res.render('error')
    }
    
})




//@  saleListPage
router.get('/historyOfUses',auth, async(req,res) => {

    let reqSessionName = req.session.name
    

    let totalAmount=0 , cashAmount=0 , cardAmount=0
    let documentCount=0 , tempRowNumber=0

    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let reqStartDateCalendar = req.query.startDateCalendar;
    let reqEndDateCalendar = req.query.endDateCalendar

    let searchOrder = req.query.searchOrder;

    let queryStartDate, queryEndDate;
    

    let LogObject

    // let match={}
    // if(req.query.requestDate){
    //     match.timestamp = req.query.requestDate === 'true'
    // }

    try{
        
        //@ [1] This is date setting which recieved calendar date from view page 
        if(reqStartDateCalendar === '' || typeof reqStartDateCalendar === 'undefined' ){
            queryStartDate = '01/01/2020'
        }else{
            queryStartDate = moment(reqStartDateCalendar).utcOffset('+0700')
            queryStartDate = queryStartDate
        }
    
        if(reqEndDateCalendar === '' || typeof reqEndDateCalendar === 'undefined' ){
            queryEndDate = '12/12/2020'
        }else{
            queryEndDate = moment(reqEndDateCalendar).utcOffset('+0700')
            queryEndDate = queryEndDate.add(1,'day')
        }

    
        // This is getting page datas
        if(searchOrder === 'paymentOrder' ){
             logObject = await Log.find({ timestamp : {$gte : queryStartDate ,  $lte : queryEndDate } }).sort({ payment: -1}).limit(pageLimit)
        }
        else{
             logObject = await Log.find({ timestamp : {$gte : queryStartDate ,  $lte : queryEndDate } }).sort({ timestamp: -1}).limit(pageLimit)
        } 

        for(index in logObject){
            
            //if(logObject[index].rowNumber == undefined || logObject[index].rowNumber === null || logObject[index].rowNumber == '' )
            if(tempRowNumber == 0 ){
                tempRowNumber = documentCount
            }
            logObject[index].rowNumber = tempRowNumber
            tempRowNumber =  tempRowNumber -1


            logObject[index].timestampFormat = moment(logObject[index].timestamp).format('YYYY/MM/DD hh:mm:ss') 

        } 

         //@ This is rendering that variables into view page 
        res.render('historyOfUses', {
            reqSessionName,
            reqStartDateCalendar,
            reqEndDateCalendar ,
            searchOrder,
            logObject : logObject,
            pageLimit
        })

        // res.json({
        //     logObject
        // })
    
    }catch(e){
        console.log(e)
        // res.render('error')
    }
    
})



//@  equipments 
router.get('/equipments',auth, async(req,res) => {

    let reqSessionName = req.session.name

    let searchData= req.query.searchData;
    let searchDataToInt 

    let searchOrder= req.query.searchOrder;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let documentCount=0 , tempRowNumber=0

    let logObject 

    moment.locale('KO');  

    try{
        
        searchDataToInt = parseInt(searchData)
        console.log(chalk.redBright('searchDataToInt : '+searchDataToInt))

        //@First Query 
        //This is counting of record
        documentCount = await Log.find({}).countDocuments()


       if(searchData) {
            // This is getting page datas 
            if(searchOrder === 'regDateOrder' ){
                if(Number.isInteger(searchDataToInt)){
                    logObject = await Log.find({ 
                        $or : [
                            {
                                uid: {$regex: searchData} 
                            },
                            {
                                balance: parseInt(searchData)
                            
                            }
                        ] 
                    }).sort({regDate: -1}).limit(pageLimit)
                }else{
                    logObject = await Log.find({  uid: {$regex: searchData} }).sort({regDate: -1}).limit(pageLimit)
                }

            }else if(searchOrder === 'balanceOrder'){
                if(Number.isInteger(searchDataToInt)){
                    logObject = await Log.find({ 
                        $or : [
                            {
                                uid: {$regex: searchData} 
                            },
                            {
                                balance: parseInt(searchData)
                            
                            }
                        ] 
                    }).sort({regDate: -1}).limit(pageLimit)
                }else{
                    logObject = await Log.find({  uid: {$regex: searchData} }).sort({balance: -1}).limit(pageLimit)
                }
            }else{
                if(Number.isInteger(searchDataToInt)){
                    logObject = await Log.find({ 
                        $or : [
                            {
                                uid: {$regex: searchData} 
                            },
                            {
                                balance: parseInt(searchData)
                            
                            }
                        ] 
                    }).sort({regDate: -1}).limit(pageLimit)
                }else{
                    logObject = await Log.find({  uid: {$regex: searchData} }).sort({timestamp: -1}).limit(pageLimit)
                }
            }
        }else { // This is excute when condition which req.query.searchData is empty 
            if(searchOrder === 'regDateOrder' ){
                logObject = await Log.aggregate( [ { 
                    $group : {
                         _id : "$deviceId", 
                         day:{ $last: "$timestamp" },
                    } 
                } ] )
                .sort({regDate: -1}).limit(pageLimit)
            }else if(searchOrder === 'balanceOrder'){
                logObject = await Log.aggregate( [ { 
                    $group : {
                         _id : "$deviceId", 
                         day:{ $last: "$timestamp" },
                    } 
                } ] ).sort({balance: -1}).limit(pageLimit)
            }else{
                logObject = await Log.aggregate( [ { 
                    $group : {
                         _id : "$deviceId", 
                         day:{ $last: "$timestamp" },
                    } 
                } ] ).sort({timestamp: -1}).limit(pageLimit)
            }
        }

        for(index in logObject){
            
            //if(logObject[index].rowNumber == undefined || logObject[index].rowNumber === null || logObject[index].rowNumber == '' )
            if(tempRowNumber == 0 ){
                tempRowNumber = 1
            }
            logObject[index].rowNumber = tempRowNumber
            tempRowNumber =  tempRowNumber +1
            

            logObject[index].regDateFormat = moment(logObject[index].regDate).format('llll:ss')
            logObject[index].timestampFormat = moment(logObject[index].timestamp).format('llll:ss')
        }

         //@ This is rendering that variables into view page 
        res.render('equipments', {
            reqSessionName,
            searchData,
            searchOrder,
            logObject : logObject,
            pageLimit
        })

 
    }catch(e){
        console.log(e)
        // res.render('error')
    }
    
})



//@  issueStatus 
router.get('/issueStatus', auth, async(req,res) => {

    let reqSessionName = req.session.name

    let searchData= req.query.searchData;
    let searchDataToInt 

    let searchOrder= req.query.searchOrder;
    let pageLimit = parseInt(req.query.pageLimit) || 10;

    let documentCount=0 , tempRowNumber=0

    let logObject 

    moment.locale('KO');  

    try{
        
        searchDataToInt = parseInt(searchData)
        console.log(chalk.redBright('searchDataToInt : '+searchDataToInt))

        //@First Query 
        //This is counting of record
        documentCount = await Tag.find({}).countDocuments()


       if(searchData) {
            // This is getting page datas 
            if(searchOrder === 'regDateOrder' ){
                if(Number.isInteger(searchDataToInt)){
                    logObject = await Tag.find({ 
                        $or : [
                            {
                                uid: {$regex: searchData} 
                            },
                            {
                                balance: parseInt(searchData)
                            
                            }
                        ] 
                    }).sort({regDate: -1}).limit(pageLimit)
                }else{
                    logObject = await Tag.find({  uid: {$regex: searchData} }).sort({regDate: -1}).limit(pageLimit)
                }

            }else if(searchOrder === 'balanceOrder'){
                if(Number.isInteger(searchDataToInt)){
                    logObject = await Tag.find({ 
                        $or : [
                            {
                                uid: {$regex: searchData} 
                            },
                            {
                                balance: parseInt(searchData)
                            
                            }
                        ] 
                    }).sort({regDate: -1}).limit(pageLimit)
                }else{
                    logObject = await Tag.find({  uid: {$regex: searchData} }).sort({balance: -1}).limit(pageLimit)
                }
            }else{
                if(Number.isInteger(searchDataToInt)){
                    logObject = await Tag.find({ 
                        $or : [
                            {
                                uid: {$regex: searchData} 
                            },
                            {
                                balance: parseInt(searchData)
                            
                            }
                        ] 
                    }).sort({regDate: -1}).limit(pageLimit)
                }else{
                    logObject = await Tag.find({  uid: {$regex: searchData} }).sort({timestamp: -1}).limit(pageLimit)
                }
            }
        }else { // This is excute when condition which req.query.searchData is empty 
            if(searchOrder === 'regDateOrder' ){
                logObject = await Tag.find({}).sort({regDate: -1}).limit(pageLimit)
            }else if(searchOrder === 'balanceOrder'){
                logObject = await Tag.find({}).sort({balance: -1}).limit(pageLimit)
            }else{
                logObject = await Tag.find({}).sort({timestamp: -1}).limit(pageLimit)
            }
        }

        for(index in logObject){
            
            //if(logObject[index].rowNumber == undefined || logObject[index].rowNumber === null || logObject[index].rowNumber == '' )
            if(tempRowNumber == 0 ){
                tempRowNumber = documentCount
            }
            logObject[index].rowNumber = tempRowNumber
            tempRowNumber =  tempRowNumber -1
            

            logObject[index].regDateFormat = moment(logObject[index].regDate).format('llll:ss')
            logObject[index].timestampFormat = moment(logObject[index].timestamp).format('llll:ss')
        }

         //@ This is rendering that variables into view page 
        res.render('issueStatus', {
            reqSessionName,
            searchData,
            searchOrder,
            logObject : logObject,
            pageLimit
        })

 
    }catch(e){
        console.log(e)
        // res.render('error')
    }
    
})



//The 404 Error Route (ALWAYS Keep this as the last route)
router.get('*', function(req, res){
    res.render('error')
  });

module.exports = router