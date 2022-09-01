'use strict'

const express = require('express');
const userController = require('../controllers/user.controller');
const api = express.Router();
const mdAuth = require('../middlewares/authenticated');

//CARGAR IMAGENES/
const connectMultiparty = require('connect-multiparty');
const upload = connectMultiparty({uploadDir:'./uploads/users'});

//Rutas Públicas//
api.get('/testUser',userController.testUser);
api.post('/login', userController.login);


//Rutas Privadas//
api.post('/saveUser', userController.saveUser);
api.get('/getUsers', userController.getUsers);
api.post('/searchUsers', userController.searchUsers);

api.post('/obtenerOrganizadoresPorGenero', [mdAuth.ensureAuth, mdAuth.isAdmin], userController.getOrganizersForGender);
api.delete('/deleteUser/:id', userController.deleteUser);
api.put('/updateUser/:id',  userController.updateUser);
api.get('/getUser/:id', userController.getUser);

//Rutas Control de Tablas//
api.get('/getUsersNameUp', userController.getUsersNameUp);
api.get('/getUsersNameDown', userController.getUsersNameDown);
api.get('/getUsersSurnameUp', userController.getUsersSurnameUp);
api.get('/getUsersSurnameDown', userController.getUsersSurnameDown);
api.get('/getUsersUsernameUp', userController.getUsersUsernameUp);
api.get('/getUsersUsernameDown', userController.getUsersUsernameDown);
api.get('/getUsersAgeUp', userController.getUsersAgeUp);
api.get('/getUsersAgeDown', userController.getUsersAgeDown);

//Carga de Imágenes//
api.post('/uploadImage/:id', [mdAuth.ensureAuth, upload], userController.addImageUser);
api.get('/getImage/:fileName',  upload, userController.getImageUser);

module.exports = api;