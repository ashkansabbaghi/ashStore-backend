const mongoose = require('mongoose')

const connections = mongoose.connect("mongodb://127.0.0.1:27017/ashstore")

exports.connections = connections