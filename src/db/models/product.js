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
    price_per_unit : {type: Number,required: true},
    created_at: {type: Date,required: true,default : Date.now()},
    published_at: {type: Date,required: true},
    start_at: {type: Date,required: true},
    end_at: {type: Date,required: true},
})

module.exports = mongoose.model('Product', ProductSchema)