const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    res.send('Sector D-17 Master');
});

module.exports = router;
