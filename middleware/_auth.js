
const jwt = require('jsonwebtoken');
const chalk = require('chalk');
const Account = require('../models/_account');
const fs = require('fs');
const path = require('path');

//Custmizing and declearing middleware as auth 
const auth = async (req, res, next) => {
    // console.log(chalk.greenBright("auth middleware"))
    // next()

    try {
        // const tokenHeader = req.header['authorization']

      const token = req.header('authorization').replace('Bearer ', '')
      const decoded = jwt.verify(token, 'secretkey')
      const account = await Account.findOne({ id:decoded.id, 'tokens.token':token })
      
      console.log(chalk.greenBright('Auth.js Token : '+token)) 

      if(!account){
          throw new Error()
      }

      req.token = token
      req.account = account 

      next()

       
    } catch(e){
        console.error('Auth.JS Error ! : ' + e )
        // res.status(401).send({ 
        //     status : '401',
        //     error: 'Please authenticate',
        //     errorMessage : e,
        //     tokenAccount : req.account
        //  })

        // res.render('landing',{

        // })
    }

}


// const FunctionTest = async () => {
//     const token = jwt.sign({ id:'GS' }, 'thisisgs', {expiresIn: '1 second'}) //
//     console.log(token) //Base64 = 1.Header 2.Body 3.Signiture 

//    const data = jwt.verify(token, 'thisisgs')
//    console.log(chalk.blueBright(JSON.stringify(data)))
// }

// FunctionTest();

module.exports = auth