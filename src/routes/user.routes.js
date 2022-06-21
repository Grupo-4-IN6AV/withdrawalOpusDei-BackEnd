'use strict'

const express = require('express');
const userController = require('../controllers/user.controller');
const api = express.Router();
const mdAuth = require('../middlewars/authenticated');

//Rutas Públicas//
api.get('/testUser',userController.testUser);
api.post('/login', userController.login);


//Rutas Privadas//
api.post('/crearOrganizador', [mdAuth.ensureAuth, mdAuth.isAdmin], userController.saveOrganizers);
api.get('/obtenerOrganizadores', [mdAuth.ensureAuth, mdAuth.isAdmin], userController.getOrganizers);
api.post('/obtenerOrganizadoresPorGenero', [mdAuth.ensureAuth, mdAuth.isAdmin], userController.getOrganizersForGender);
api.delete('/eliminarOrganizador/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], userController.deleteOrganizer);
api.put('/editarOrganizador/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], userController.updateOrganizer);
api.get('/obtenerOrganizador/:id', [mdAuth.ensureAuth, mdAuth.isAdmin], userController.getOrganizer);


module.exports = api;