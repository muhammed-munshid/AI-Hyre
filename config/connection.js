const mongoose = require('mongoose')

module.exports.connect = function () {
    mongoose.connect('mongodb://0.0.0.0:27017/al-hyre')
    console.log('mongoose connected');
}
