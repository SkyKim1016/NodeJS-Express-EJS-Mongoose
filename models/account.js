/*
* 2020, Goorumlabs
* By Sky
*/

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const chalk = require('chalk');
const jwt = require('jsonwebtoken')

const accountSchema = new mongoose.Schema({
    id: {
        type:String,
        unique:true,
        required:true,
        trime:true,
    }, 
    password: {
        type:String,
        required:true,
        trim:true,
        // validate(value) {
        //     if (value.toLowerCase().includes('password')) {
        //         throw new Error('Password cannot contain "password"')
        //     }
        // }
    },
    branch_name:{
        type:String,
        required:true,
        trim:true,
    },
    email: {
        type:String,
        trim: true,
        lowercase: true,
    },
    phone_number:{
        type:String,
        trim: true
    },
    last_login:{
        type: Date, 
        default: Date.now
    },
    token: [{
        token: {
            type:String,
            required:true
        }
    }]
    
}, {
    timestamps:true
})

accountSchema.methods.generateAuthToken = async function () {
    const account = this
    const token = jwt.sign({ id:account.id.toString() }, 'SignedToken')

    account.tokens = acount.tokens.concat({ token })
    await account.save()

    return token
}

accountSchema.statics.findByCredentials = async (id, password) => {
    const account = await Account.findOne({ id })
    if(!account){
        throw new Error('ID is empty')
    }

    // [If want to use bcrypt.hash password]
    // const isMatch = await bcrypt.compare(password, account.password)
    // console.log(chalk.bgYellowBright('req.password = '+password))
    // console.log(chalk.bgYellowBright('db.password = '+account.password))

    if(account.password != password){
        throw new Error('Password not matched')
    } 

     return account
}

// [ Password bcrypt.hash ]
// accountSchema.pre('save', async function(next){
//     const account = this

//     if(account.isModified('password')){
//         account.password = await bcrypt.hash(account.password, 8)
//     }
//     console.log('just beore saving!')

//     next()
// })

const Account = mongoose.model('Account', accountSchema)

module.exports = Account