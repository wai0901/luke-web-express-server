const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const cartsSchema = new Schema({
    userId: {
        type: String
    },
    purchased: {
        type: Boolean,
        required: true,
    },
    cartItems: [{
        type: Object,
        required: true,
    }],
}, {
    timestamps: true
});

module.exports = mongoose.model('Carts', cartsSchema)



