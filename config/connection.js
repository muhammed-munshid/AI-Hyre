const mongoose = require('mongoose')

module.exports.connect = function () {
    mongoose.connect('mongodb+srv://munshid:munshid123@cluster0.fyiocsw.mongodb.net/al-hyre?retryWrites=true&w=majority')
    console.log('mongoose connected');
}
