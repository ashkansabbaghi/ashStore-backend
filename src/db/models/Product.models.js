const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    // tag id
    // category id
    //seller id
    // hot product
    // gallery image id
    name: {type: String,required:true},
    description: {type: String,required:true},
    unit: {type: Number,required:true},
    pricePertUnit : {type: Number,required: true},
    publishedAt: {type: Date,required: true},
    startAt: {type: Date,required: true},
    endAt: {type: Date,required: true},
}, {timestamps: true})

module.exports = mongoose.model('Product', ProductSchema)
