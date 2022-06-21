'use strict'

const mongoose = require('mongoose');
const eventSchema = mongoose.Schema({
    name: String,
    typeEvent: String,
    startDate: Date,
    endDate: Date,
    typePublic: String,
    organizer: {type: mongoose.Schema.ObjectId, ref : 'User'},
    house: {type: mongoose.Schema.ObjectId, ref : 'House'},
});

module.exports = mongoose.model('Event', eventSchema);