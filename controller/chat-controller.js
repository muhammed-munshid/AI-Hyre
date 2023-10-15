const crypto = require('crypto')
const chatModel = require("../model/chatModel");
const User = require('../model/userModal');

module.exports = {

    addChat: async (req, res) => {
        try {
            const { users, job } = req.body;

            // Check if a chat already exists between the two users and post
            const existingChat = await chatModel.findOne({ users: { $all: users }, job: job });
        
            if (existingChat) {
              // A chat already exists, so return it instead of creating a new one
              res.status(200).send(existingChat);
              return;
            }
        
            // Create a new chat if one doesn't already exist
            const chat = new chatModel({ users, job });
            await chat.save();
            res.status(201).send(chat);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },


    viewMessageById: async (req, res) => {
        try {
            const chat = await chatModel.findById(req.params.id).populate('users messages.sender messages.receiver', 'name email')
            res.send(chat);
        } catch (err) {
            console.log(err)
            res.status(400).send(err);
        }
    },

    //list of all the chats that the user is a part of
    v1Chat: async (req, res) => {
        try {
            const { id } = req.params;
            const chats = await chatModel.find({ candidate: id, recruiter:id })
                .populate('candidate', 'recruiter')
                .populate({
                    path: 'messages',
                    options: { sort: { time: -1 }, limit: 1 },
                    populate: {
                        path: 'sender receiver',
                        select: 'username'
                    }
                })
                .exec();
            const chatList = chats.map(chat => ({
                id: chat._id,
                candidate: chat.candidate,
                post: chat.post,
                lastMessage: chat.messages[0]?.message,
                lastMessageTime: chat.messages[0]?.time
            }));
            res.status(200).send(chatList);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },

    //same as above
    viewChat: async (req, res) => {
        try {
            const id = req.params.id
            const users = await User.findById(id)          
                const chats = await chatModel.find({ users: id })
                  .populate({ path: 'users', select: 'name', transform: 'name' })
                  .populate({
                    path: 'messages',
                    options: { sort: { time: -1 }, limit: 1 },
                    populate: {
                      path: 'sender receiver',
                      select: 'name'
                    }
                  })
                  .exec();
                const chatList = await Promise.all(chats.map(async chat => {
                  const unreadCount = await chatModel.countDocuments({
                    _id: chat._id,
                    'messages.status': 'sent',
                    'messages.sender': { $ne: id }
                  });
                  return {
                    id: chat._id,
                    users: chat.users,
                    post: chat.post,
                    lastMessage: chat.messages[0]?.message,
                    lastMessageTime: chat.messages[0]?.time,
                    unreadCount
                  };
                }));
                res.send(chatList);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },

    addMessage: async (req, res) => {
        try {
            const chat = await chatModel.findById(req.params.id);

            if (!chat) {
                return res.status(404).send({ error: 'Chat not found' }); // Handle chat not found
            }

            const { message, sender, receiver } = req.body;
            const messageId = crypto.randomBytes(5).toString('hex');

            chat.messages.push({
                id: messageId,
                message,
                sender,
                receiver,
                status: 'sent',
                time: Date.now(),
            });

            await chat.save();
            res.status(200).send(chat);

        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },

    //update the status of an individual message in a chat
    updateChat: async (req, res) => {
        try {
            const { chatId, messageId } = req.params;
            const { status } = req.body;
            const chat = await chatModel.findById(chatId);
            const messageIndex = chat.messages.findIndex(message => message.id === messageId);
            if (messageIndex === -1) {
                return res.status(404).send({ error: 'Message not found' });
            }
            chat.messages[messageIndex].status = status;
            await chat.save();
            res.status(200).send(chat);
        } catch (err) {
            res.status(500).send(err);
        }
    }

}