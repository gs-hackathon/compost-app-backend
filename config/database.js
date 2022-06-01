const mongoose = require('mongoose');
// const { connect } = require('socket.io-client');

/**
 * ---- DATABASE DEFINITION ----
 * 
 * Connect to Databse using .env file
 * DB_STRING or
 * DB_STRING_PROD for production
 */

// Define Databse URL
const devConnection = process.env.DB_STRING; // Localhost DB
const prodConnection = process.env.DB_STRING_PROD // Production DB 
    // Conntect to the correct environment

if (process.env.NODE_ENV === 'production') {
    // Production Connection
    connectDB = async() => {
        try {
            const conn = await mongoose.connect(prodConnection, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            console.log(`MongoDB Connected: ${conn.connection.host}`)
        } catch (err) {
            console.log(err);
            process.exit(1);
        }
    }
} else {
    // Development Connection
    connectDB = async() => {
        try {
            const conn = await mongoose.connect(devConnection, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            console.log(`MongoDB Connected: ${conn.connection.host}`)
        } catch (err) {
            console.log(err);
            process.exit(1)
        }
    }
}

module.exports = connectDB;