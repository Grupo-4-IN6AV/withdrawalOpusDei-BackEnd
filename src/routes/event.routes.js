'use strict'

const express = require('express');
const eventController = require('../controllers/event.controller');
const api = express.Router();
const mdAuth = require('../middlewares/authenticated');

//Rutas Públicas//
api.get('/testEvent', eventController.testEvent);
api.get('/obtenerEventos', eventController.getEvents);
api.get('/obtenerEventosPorCasa/:id', eventController.getEventsForHouse);
api.get('/obtenerEvento/:id', eventController.getEvent);

//Rutas privadas
api.post('/crearEvento', [mdAuth.ensureAuth, mdAuth.isAdmin], eventController.saveEvent);
api.delete('/eliminarEvento/:id',[mdAuth.ensureAuth, mdAuth.isAdmin], eventController.deleteEvent);
api.put('/editarEvento/:id',[mdAuth.ensureAuth,mdAuth.isAdmin],eventController.updateEvent);
api.get('/getEvent/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], eventController.getEvent);

module.exports = api;