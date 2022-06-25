'use strict'

const express = require('express');
const roomController = require('../controllers/room.controller');
const api = express.Router();
const mdAuth = require('../middlewares/authenticated');

//Ruta pública de testeo
api.get('/testRoom', roomController.testRoom);
api.get('/obtenerHabitaciones', roomController.getRooms);
api.get('/obtenerHabitacionesPorCasa/:id', roomController.getRoomsForHouse);
api.get('/obtenerHabitacion/:id', roomController.getRoom);

//Rutas Privadas//
api.post('/crearHabitacion', [mdAuth.ensureAuth, mdAuth.isAdmin], roomController.saveRoom)
api.delete('/eliminarHabitacion/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], roomController.deleteRoom)
api.put('/editarHabitacion/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], roomController.updateRoom)

module.exports = api;