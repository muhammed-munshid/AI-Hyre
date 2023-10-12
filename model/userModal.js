const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
    },
    phone: {
        type: Number
    },
    password: {
        type: String
    },
    profile_pic: {
        type: String
    },

    // common fields for all users
}, { discriminatorKey: 'role' });

const User = mongoose.model('User', userSchema);

module.exports = User;