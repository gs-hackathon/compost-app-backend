const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.get('/', function(req, res, next) {
    res.send("ok");
})

router.post('/signup', authController.postAddUser);

router.post('/signin', authController.postLoginUser);

router.post('/verify', authController.postVerifyUser);

module.exports = router;