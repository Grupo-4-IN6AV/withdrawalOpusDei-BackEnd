'use strict'

const mongoose = require('mongoose');
const houseSchema = mongoose.Schema({
    name: String,
    country: String,
    township: String,
    address: String,
    rooms: 
    [{
        quantityBeds: Number,
        availability: Boolean,
        nameRoom: String,
    }]
});

module.exports = mongoose.model('House',houseSchema);