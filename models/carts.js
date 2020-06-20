const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const cartsSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    main: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    images: [ String ],
    position: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    style: {
        type: String,
        required: true,
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    size: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

const Carts = mongoose.model('Carts', cartsSchema)

module.exports = Carts;

