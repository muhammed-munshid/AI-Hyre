const express = require('express');
const recruiterController = require('../controller/recruiter-controller');
const router = express.Router();

router.get('/candidates',recruiterController.candidates)

router.post('/sign-up',recruiterController.signUp)
router.post('/sign-in',recruiterController.signIn)

module.exports = router