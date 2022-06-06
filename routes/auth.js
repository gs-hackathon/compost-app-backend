const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/signup', authController.postAddUser);

router.post('/signin', authController.postLoginUser);

router.post('/verify', authController.postVerifyUser);

router.post('/sendSms', authController.postSendOTP);

router.post('/complate', authController.postComplateRegisterUser);

module.exports = router;