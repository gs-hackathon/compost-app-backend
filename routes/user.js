const express = require('express');
const router = express.Router();

router.use('/', function(req, res, next) {
    res.send("ok");
})

module.exports = router;