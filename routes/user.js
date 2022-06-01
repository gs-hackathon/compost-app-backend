const express = require('express');
const router = express.Router();

router.use('/', function(req, res, next) {
    return "ok"
})

module.exports = router;