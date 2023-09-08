const express = require('express');
const userController = require('../controller/user-controller');
const router = express.Router();

router.post('/sign-up',userController.signUp)
router.post('/sign-in',userController.signIn)

router.put('/add-profile/:id',userController.addProfile)
router.put('/add-details/:id',userController.addDetails)

module.exports = router