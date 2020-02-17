const chalk = require('chalk');

const auth = async (req, res, next) => {
    reqSession = req.session;
    // console.log(chalk.blueBright('reqSession.loginCheck : ' + reqSession.loginCheck ))
    try{
        if( reqSession.loginCheck === 'true'){
            next()
        }else{
        //    res.redirect('/')
            res.render('error', {
                
            })
        }
        
    }catch(e){
        console.error(e)
    }
  

}

module.exports = auth