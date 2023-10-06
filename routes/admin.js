const express = require('express');
const adminController = require('../controller/admin-controller');
const router = express.Router();

router.get('/jobs', adminController.jobs)

module.exports = router