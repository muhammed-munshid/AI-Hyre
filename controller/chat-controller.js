const crypto = require('crypto')
const chatModel = require("../model/chatModel");

module.exports = {

    messages: async (req, res) => {
        try {
            const chat = await chatModel.findById(req.params.id).populate('candidate recruiter messages.sender messages.receiver', 'name email').maxTimeMS(20000)
            console.log('chat', chat.messages);
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
            const chats = await chatModel.find({ candidate: id })
                .populate('candidate', 'username')
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
            res.send(chatList);
        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    },

    //same as above
    viewChat: async (req, res) => {
        try {
            const { id } = req.params;
            const chats = await chatModel.find({ candidate: id })
                .populate({ path: 'candidate', select: 'name', transform: 'name' })
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
                    candidate: chat.candidate,
                    post: chat.post,
                    lastMessage: chat.messages[0]?.message,
                    lastMessageTime: chat.messages[0]?.time,
                    unreadCount
                };
            }));
            res.send(chatList);
        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    },

    createChat: async (req, res) => {
        try {
            const { candidate, recruiter, job } = req.body;

            // Check if a chat already exists between the two candidaate and post
            const existingChat = await chatModel.findOne({ candidate, recruiter, job });
            console.log('exist:', existingChat);

            if (existingChat) {
                // A chat already exists, so return it instead of creating a new one
                res.status(200).send(existingChat);
                return;
            }

            // Create a new chat if one doesn't already exist
            const chat = new chatModel({ candidate, recruiter, job });
            await chat.save();
            res.status(201).send(chat);
        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    },

    //Adding a message into a chat:
    message: async (req, res) => {
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

            res.status(201).send(chat);

        } catch (err) {
            console.log(err);
            res.status(400).send(err);
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
            res.send(chat);
        } catch (err) {
            res.status(400).send(err);
        }
    }

}