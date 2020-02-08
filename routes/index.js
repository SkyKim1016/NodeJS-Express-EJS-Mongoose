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

// router.get('/', (req,res) => res.render('login',{

//   }))
    

router.get('/', (req,res) => res.render('landing',{

}))

router.get('/list', async(req,res) => {
    // const _id = req.params.id

    try{
        const logObject = await Log.find({}).sort({timestamp: -1})

        // logDatas = JSON.stringify(logDocument)
        // console.log(chalk.blueBright(guestBookObjectDatas))

        res.render('list', {
            logObject : logObject
        })
    
    }catch(e){
        res.status(400)
    }
    
})

module.exports = router