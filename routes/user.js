const express = require('express');
const userController = require('../controller/user-controller');
const router = express.Router();

router.post('/sign-up',userController.signUp)
router.post('/sign-in',userController.signIn)

module.exports = router