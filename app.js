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

// Middleware para verificação do token
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

/** Middlewares */
app.use(cors()) // O CORS é um pacote node.js para fornecer um middleware do Connect / Express que pode ser usado para ativar o CORS com várias opções
app.use(helmet()) // Ajuda a proteger aplicativos Express, configurando vários cabeçalhos HTTP
app.use(morgan('dev')) // Middleware do log de solicitações HTTP para node.js
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }))
app.use(bodyParser.json({ limit: '5mb' }))
app.use(passport.initialize()) // Middleware de autenticação para node.js
app.use(cookieParser("platformconfinement"))

/** Passport config */
require('./src/config/passport')(passport)

/** Routas */
app.use('/api/user', userRoutes);
app.use('/api/confinement', VerifyToken, confinementRoutes); // Essa rota necessita de token

// Conecta com o banco de dados
mongoose.connection
    .once('open', function () {
        if (process.env.NODE_ENV != 'test')
            console.log('MongoDB database connection established successfully');
    })
    .catch(e => console.log(e));

module.exports = app;