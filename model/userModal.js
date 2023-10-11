const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    // common fields for all users
}, { discriminatorKey: 'role' });

const User = mongoose.model('User', userSchema);

module.exports = User;