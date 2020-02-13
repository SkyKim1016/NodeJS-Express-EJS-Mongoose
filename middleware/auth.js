
const jwt = require('jsonwebtoken');
const chalk = require('chalk');
const Account = require('../models/account');

//Custmizing and declearing middleware as auth 
const auth = async (req, res, next) => {
    // console.log('auth middleware')
    // next()

    try {
      const token = req.header('Authorization').replace('Bearer ', '')
      const decoded = jwt.verify(token, 'SignedToken')
      const account = await Account.findOne({ id:decoded.id, 'tokens.token':token })

      if(!account){
          throw new Error()
      }

      req.account = account 
      next()

        // console.log(chalk.greenBright(token)) 
    } catch(e){
        res.status(401).send({ error: 'Please authenticate' })
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