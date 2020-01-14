require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

const environment = process.env.NODE_ENV;
const stage = require('./server/config')[environment];

const cors = require('cors');
const {socketIo} = require('./server/socket');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));

app.use(cors());
//Enable CORS for all HTTP methods
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);

if (environment !== 'production') {
    app.use(logger('dev'));
}

const routes = require('./server/routes/index.js');

app.use('/', require('./server/routes/home'));
app.use('/api', routes(router));

const server = app.listen(`${stage.port}`, () => {
    console.log(`Server now listening at localhost:${stage.port}`);
});
let serverNames = [];
serverNames = socketIo(server, serverNames);

console.log('serverNames', serverNames);
module.exports = app;