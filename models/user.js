const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    street: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    state: {
        type: String,
        default: ''
    },
    zip: {
        type: Number,
        default: ''
    },
    tel: {
        type: Number,
        default: ''
    },
    username: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    promotion: {
        type: Boolean,
        default: true
    },
    facebookId: String,
    admin: {
        type: Boolean,
        default: false
    }
});

//this plugin will do the schema instead of we do it ourself
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);