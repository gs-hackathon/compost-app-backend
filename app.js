/**
 * Import libraries, routers, controllers, database connection
 */

// Import Libraries
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path')
const rfs = require('rotating-file-stream')
const morgan = require('morgan');

const Auth = require('./middleware/auth');

// Configure environment variables
require("dotenv").config()

// Import Database
const connectDB = require('./config/database');

// Import Routes
const { RoutesWithOuthJWT, RoutesWithJWT } = require("./config/routes");

// Set up Express
const app = express();

/**
 *--------- GENERAL SETUP -------------
 */

// Morgan Logger
app.use(morgan('dev'));

// Morgan Logger Save
var accessLogStream = rfs.createStream("access.log", {
    interval: "1d", // rotate daily
    path: path.join(__dirname, "log"),
});
app.use(morgan("combined", { stream: accessLogStream }));

// Connect to Database
connectDB()

// Express body-parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Set up helmet

app.use(helmet());

// Set up cors - GET, POST, PUT, PATCH, and other REQUEST

app.use(cors({
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

// Set up Routers

RoutesWithJWT.forEach((route) => {
    try {
        app.use(route.route, Auth, route.function);
        console.log("Created route:", route.name, "on works: http://" + process.env.SERVER_HOST + ":" + process.env.SERVER_PORT + route.route);
    } catch (err) {
        console.log(err);
        console.error("Error while adding route:", route.name);
    }
});

RoutesWithOuthJWT.forEach((route) => {
    try {
        app.use(route.route, route.function);
        console.log("Created route:", route.name, "on works: http://" + process.env.SERVER_HOST + ":" + process.env.SERVER_PORT + route.route);
    } catch (err) {
        console.log(err);
        console.error("Error while adding route:", route.name);
    }
});

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.message = 'Invalid route';
    error.status = 404;
    next(error);
});
// log errors to console
app.use(logErrors);
//
app.use(clientErrorHandler);
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.json({
        status: error.status || 500,
        message: error.message,
        error: {
            error: error.message,
        },
    });
});

// log errors to console
function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}
// error handling for xhr request
function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        //console.log('xhr request');
        res.status(400).send({ status: 400, message: "Bad request from client", error: err.message });
    } else {
        next(err);
    }
}


module.exports = app;