const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const orderSchema = new Schema({
    userId: {
        type: String
    },
    orders: [{
        type: Object,
        required: true,
    }],
    orderTotal: {
        type: Currency,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Order', orderSchema)


