const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({

    customerId: {
        type: String,
        required: true,
    },
    products: {
        // item cart
        productId: {
            type: String,
        },
        quantity: {
            type: String,
        },
    }


}, {
    timestamps: true
})

module.exports = mongoose.model('Cart', CartSchema)