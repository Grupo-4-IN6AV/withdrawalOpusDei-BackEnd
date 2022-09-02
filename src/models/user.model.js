'use strict'

const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    surname: String,
    age: String,
    role: String,
    gender: String,
    phone: String,
    image: String,
    imageBase64: String
});

module.exports = mongoose.model('User', userSchema);