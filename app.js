/*
* 2020, Goorumlabs
* By EUNGJU
*/

// server.js
// [LOAD PACKAGES]

const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser');
const mongoose    = require('mongoose');
const path        = require('path');  // For getting public directory path 
const chalk       = require('chalk'); // For consol log color
const morgan      = require('morgan'); // For printing URL which called REST from website 
const hbs         = require('hbs'); // For printing javascript variables in client files which are .hbs in public directory 

require('dotenv').config()  // loads .env file which inluded Mongodb connect URL and Port 

// [ CONFIGURE mongoose ]

// CONNECT TO MONGODB SERVER
var db = mongoose.connection;
// db.on('error', console.error);
// db.once('open', function(){
//     // CONNECTED TO MONGODB SERVER
//     console.log("Connected to mongod server");
// });

mongoose.connect('mongodb://localhost/smartCoinDB', {
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:true,
    useUnifiedTopology:true
}).then( ()=> console.log(chalk.blue.bold('Connected to mongoDB server')) )


// [ CONFIGURE .hbs view engine ]
const publicDirectoryPath = path.join(__dirname, '/public/')
app.use(express.static(publicDirectoryPath))
    .set('views',publicDirectoryPath) // Setting handlebar engine and views location
    .set('view engine', 'hbs')
 
hbs.registerPartials(publicDirectoryPath+ '/partials') // For deviding and registing header and footer on .hbs files 


// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morgan('dev')); // For printing requested RESTFUL URL on console 


// [ CONFIGURE .hbs view engine ]


// [CONFIGURE SERVER PORT]

var port = process.env.PORT || 8080;

// [CONFIGURE ROUTER]
// var router = require('./routes')(app, Tag, Log);
const router = require('./routes/index')
app.use(router);

// [RUN SERVER]
var server = app.listen(port, function(){
 console.log(chalk.blue.bold("Express server has started on port " + port));
});
