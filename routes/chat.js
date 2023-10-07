const express = require('express');
const chatController = require('../controller/chat-controller');
const passport = require('passport')
const router = express.Router();

passport.initialize();

router.get('/:id/messages', chatController.messages)
router.get('/v1/:id/user', chatController.v1Chat)
router.get('/:id/user', chatController.viewChat)

router.post('/create', chatController.createChat)
router.post('/:id/messages', chatController.message)

router.patch('/:chatId/messages/:messageId', chatController.updateChat)

module.exports = router