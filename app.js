const express      = require('express');
const mongoose     = require('mongoose');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const passport     = require('passport');
const cors         = require('cors');
const morgan       = require('morgan');
const helmet       = require('helmet');

/** Models */
require('./src/models');

//token manager
const VerifyToken = require('./src/config/verifyToken');

require('dotenv').config({});

global.XMLHttpRequest = require('xhr2');

let MONGO_URI = process.env.MONGO_URI;

/** Mongo Config */
mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    //bufferCommands: false,
    connectTimeoutMS: 600000,
    socketTimeoutMS: 600000,
    useUnifiedTopology: true
});

/** Configs */
const app = express()

/** Route Files */
const userRoutes = require('./src/routes/userRoute')
const confinementRoutes = require('./src/routes/confinementRoute')

/** middleware */
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }))
app.use(bodyParser.json({ limit: '5mb' }))
app.use(passport.initialize())
app.use(cookieParser("platformconfinement"))

/** Passport config */
require('./src/config/passport')(passport)

/** Routes */
app.use('/api/user', userRoutes);
//app.use('/api/confinement', VerifyToken, confinementRoutes);

mongoose.connection
    .once('open', function () {
        if (process.env.NODE_ENV != 'test')
            console.log('MongoDB database connection established successfully');
    })
    .catch(e => console.log(e));

module.exports = app;