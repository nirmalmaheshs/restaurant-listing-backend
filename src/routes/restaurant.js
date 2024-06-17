const express = require('express');
const auth = require("../middleware/auth");
const router = express.Router();

router.get('/', auth, (req, res) => {
    res.json({message: 'Welcome to restaurant'});
});

module.exports = router;
