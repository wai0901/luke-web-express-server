const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const contactSchema = new Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    contactMe: {
        type: Boolean,
    },
    email: {
        type: String,
    },
    phoneNum: {
        type: String,
    },
    feedback: {
        type: String,
    },
}, {
    timestamps: true
});


module.exports = mongoose.model('Contact', contactSchema)