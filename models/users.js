/**
 * 
 *-------- USER SCHEMA -----------
 * 
 * Defines the user name, email, username, and passport
 * n_id: defines user's national id
 * name: defines user's names
 * email: defines user's email
 * hash and salt: used by passport
 * phone: defines user's phone for verification.
 * otp: otp for auth
 * otpExpiration: for auth
 * timestamp: defines created and updated time
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    n_id: {
        type: Number,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
    },
    email: {
        type: String,
        lowercase: true
    },
    hash: {
        type: String
    },
    salt: {
        type: String
    },
    phone: {
        type: Number,
        required: true
    },
    otp: Number,
    otpExpirationTime: Date,
    otpConfirmed: Boolean
}, { timestamps: true })

module.exports = mongoose.model('Users', userSchema);