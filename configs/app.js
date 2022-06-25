'use strict'

//Importación de Encriptado//
const {encrypt} = require('../src/utils/validate');

//Importación del Modelo de Usuario//
const User = require('../src/models/user.model');

const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const port = 3200 || process.env.PORT;

//Importación de las Rutas//
const userRoutes = require('../src/routes/user.routes');
const houseRoutes = require('../src/routes/house.routes');
const eventRoutes = require('../src/routes/event.routes');
const roomRoutes = require('../src/routes/room.routes');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet({}));
app.use(cors());
app.use('/user', userRoutes);
app.use('/house', houseRoutes);
app.use('/event', eventRoutes);
app.use('/room', roomRoutes);

exports.initServer = ()=> app.listen(port, async ()=>
{
    const automaticUser = 
    {
        username: 'SuperAdmin',
        email: 'admin@kinal',
        name: 'SuperAdmin',
        surname: 'SuperAdmin',
        phone: 'SuperAdmin',
        password: await encrypt('AdministradorOpusDei'),
        role: 'ADMINISTRADOR'
    }

    const searchUserAdmin = await User.findOne({username: automaticUser.username})
    if(!searchUserAdmin)
    {
        let userAdmin = new User(automaticUser);
        await userAdmin.save();
        console.log('Administrador General creado correctamente.')
    }

    console.log(`Listening on port ${port}`)
});
