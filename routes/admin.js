const express = require('express');
const adminController = require('../controller/admin-controller');
const router = express.Router();

router.get('/jobs', adminController.jobs)
router.get('/candidates', adminController.candidates)
router.get('/recruiters', adminController.recruiters)

module.exports = router