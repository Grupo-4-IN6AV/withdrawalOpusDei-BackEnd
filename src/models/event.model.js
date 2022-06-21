'use strict'

const mongoose = require('mongoose');
const eventSchema = mongoose.Schema({
    name: String,
    typeEvent: String,
    startDate: Date,
    endDate: Date,
    house: {type: mongoose.Schema.ObjectId, ref : 'House'},
});

module.exports = mongoose.model('Event', eventSchema);