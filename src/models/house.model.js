'use strict'

const mongoose = require('mongoose');
const houseSchema = mongoose.Schema({
    name: String,
    country: String,
    township: String,
    address: String,
});

module.exports = mongoose.model('House', houseSchema);