'use strict'

const mongoose = require('mongoose');
const reservationSchema = mongoose.Schema({
    date: Date,
    room: {type: mongoose.Schema.ObjectId, ref : 'Room'},
    event: {type: mongoose.Schema.ObjectId, ref: 'Event'},
    client: String, //Persona que enviará su formulario para su reservación
    DPI: String,
    age: String,
    gender: String,
});

module.exports = mongoose.model('Reservation',reservationSchema);