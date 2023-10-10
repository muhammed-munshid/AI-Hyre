const express = require('express');
const followController = require('../controller/follow-controller');
const router = express.Router();

router.get('/my-followers/:id', followController.myFollowers)
router.get('/following/:id', followController.followingMe)

router.put('/user/:id', followController.toggleFollower)

module.exports = router