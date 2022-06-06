const User = require('../models/users')
const utils = require('../lib/utils');
const sms = require('../utils/sms')
const crypto = require("crypto");

// Adds new user
exports.postAddUser = async(req, res, next) => {
    try {
        // Get all fields from the clients
        const { n_id, phone } = req.body;
        /*
        // Check if email already exist
        const checkEmail = await User.findOne({
            email: email
        });
        */
        // Check if national id already exist
        const checkId = await User.findOne({
            n_id: n_id
        });
        // Check if phone already exist
        const checkPhone = await User.findOne({
            phone: phone
        });

        // return error if id exist
        if (checkId) {
            return res.status(401).json({
                message: 'National ID already exist'
            })
        }
        /*
        // return error if email exist
        if (checkEmail) {
            return res.status(401).json({
                message: 'Email already exist!'
            })
        }
        */

        // returns error if phone exist
        if (checkPhone) {
            return res.status(401).json({
                message: 'Phone already exist'
            })
        }

        // Save new User
        const newuser = await new User({
            n_id: n_id,
            phone: phone
        });
        const user = await newuser.save()

        // Respond to User
        if (newuser) {
            const tokenObject = utils.issueJWT(user);
            res.status(200).json({
                success: true,
                user: user,
                token: tokenObject.token,
                expiresIn: tokenObject.expires
            })
        }
    } catch (err) {
        console.log(err);
        // sends response for 500 error
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment."
        })
    }
}

//  User login to the application
exports.postLoginUser = async(req, res, next) => {
    try {
        // Get fields from client
        const { phone, password } = req.body;
        // Check fi username exist
        const user = await User.findOne({
            phone: phone
        })
        if (!user) {
            return res.status(401).json({
                message: 'You entered the wrong credentials!'
            })
        }
        // Check if password matches
        const isValid = utils.validPassword(password, user.hash, user.salt)
        if (isValid) {
            // return user object for authentication
            const tokenObject = utils.issueJWT(user);
            res.status(200).json({
                success: true,
                user: user,
                token: tokenObject.token,
                expiresIn: tokenObject.expires
            })
        } else {
            // Return error for wrong credentials
            return res.status(401).json({
                message: "You entered the wrong credentials!"
            });
        }
    } catch (err) {
        console.log(err);
        // sends response for 500 error
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment."
        })
    }
}

exports.postSendOTP = async(req, res, next) => {
    const { phone } = req.body;
    if (!phone) {
        return res.status(401).json({
            message: 'Empty phone!'
        })
    }

    const user = await User.findOne({
        phone: phone
    })
    if (!user) {
        return res.status(401).json({
            message: 'User can not founded!'
        })
    }

    if (user.otpConfirmed == true) {
        return res.status(401).json({
            message: 'Phone already confirmed!'
        })
    }

    var otpCode = await utils.genOTP();
    var sentSms = sms.send_sms('+90' + phone, 'Your Compost APP account verification code is: ' + otpCode);
    if (!sentSms) {
        res.status(404).json({
            message: 'While sending sms an error occured..'
        })
    }

    var date = new Date();
    var otpExpiredDate = date.setSeconds(date.getSeconds() + 60);

    User.updateOne({ phone: phone }, { $set: { otp: otpCode, otpExpirationTime: otpExpiredDate, otpConfirmed: false } }, function(err, res) {
        if (err) throw err;
    });

    res.status(200).json({
        message: 'OTP Code successfully sent..',
        expireDate: otpExpiredDate
    })
}

exports.postVerifyUser = async(req, res, next) => {
    const { phone, code } = req.body;
    if (!phone) {
        return res.status(401).json({
            message: 'Empty phone!'
        })
    }

    if (!code) {
        return res.status(401).json({
            message: 'Empty code!'
        })
    }

    const user = await User.findOne({
        phone: phone
    })
    if (!user) {
        return res.status(401).json({
            message: 'User can not founded!'
        })
    }

    if (user.otpConfirmed == true) {
        return res.status(401).json({
            message: 'Phone already confirmed!'
        })
    }

    var date = new Date();
    var exDate = new Date(user.otpExpirationTime);
    if (exDate < date) {
        return res.status(401).json({
            message: 'Code is expired!'
        })
    }

    if (user.otp != code) {
        return res.status(401).json({
            message: 'Code is not matching!'
        })
    }

    User.updateOne({ phone: phone }, { $set: { otpConfirmed: true } }, function(err, res) {
        if (err) throw err;
    });

    res.status(200).json({
        message: 'OTP successfully verified..',
    })
}

exports.postComplateRegisterUser = async(req, res, next) => {

    const { phone, password, confirm_password } = req.body;

    const user = await User.findOne({
        phone: phone
    })
    if (!user) {
        return res.status(401).json({
            message: 'User can not founded!'
        })
    }

    // Check if password and confirm password match
    if (password !== confirm_password) {
        return res.status(401).json({
            message: 'Passwords does not match!'
        })
    }

    if (user.otpConfirmed == false) {
        return res.status(401).json({
            message: 'Phone must be confirmed at first!'
        })
    }

    if (typeof user.salt != 'undefined') {
        return res.status(401).json({
            message: 'User profile already complated!'
        })
    }

    // Passport
    const saltHash = utils.genPassword(password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    User.updateOne({ phone: phone }, { $set: { salt: salt, hash: hash } }, function(err, res) {
        if (err) throw err;
    });

    return res.status(200).json({
        message: 'User profile successfully complated!'
    })
}