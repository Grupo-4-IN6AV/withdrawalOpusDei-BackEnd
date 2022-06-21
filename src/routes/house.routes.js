'use strict'

const express = require('express');
const houseController = require('../controllers/house.controller');
const api = express.Router();
const mdAuth = require('../middlewares/authenticated');

//Rutas Públicas//
api.get('/testHouse', houseController.testHouse);
api.get('/obtenerCasas', houseController.getHouses);
api.get('/obtenerCasa/:id', houseController.getHouse);


//Funciones privadas
api.post('/crearCasa', [mdAuth.ensureAuth, mdAuth.isAdmin], houseController.saveHouse);
api.delete('/eliminarCasa/:id',[mdAuth.ensureAuth, mdAuth.isAdmin], houseController.deleteHouse);
api.put('/editarCasa/:id',[mdAuth.ensureAuth,mdAuth.isAdmin],houseController.updateHouse);

module.exports = api;