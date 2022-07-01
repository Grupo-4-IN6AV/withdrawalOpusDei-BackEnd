'use strict'

const mongoose = require('mongoose');
const roomSchema = mongoose.Schema({
    availability: Boolean,
    quantityPeople: Number,
    actualQuantityPeople: Number,
    name: String,
    house: {type: mongoose.Schema.ObjectId, ref : 'House'},
});

module.exports = mongoose.model('Room',roomSchema);