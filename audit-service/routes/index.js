const express = require('express');

const router = express.Router();

const auditRoutes = require('./audit');


router.get('/', (req, res) => {
    res.send(200, 'Ok V1');
});

router.use('/', auditRoutes);

module.exports = router;


