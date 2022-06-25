'use strict'

const express = require('express');
const reservationController = require('../controllers/reservation.controller');
const api = express.Router();
const mdAuth = require('../middlewares/authenticated');

//Ruta pública de testeo
api.get('/testReservation', reservationController.testReservation);

//Rutas Públicas//
api.post('/crearReservacion', reservationController.saveReservation)

module.exports = api;