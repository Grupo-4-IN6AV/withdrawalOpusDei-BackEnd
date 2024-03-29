'use strict'

//Importación de Encriptado//
const {encrypt} = require('../src/utils/validate');

//Importación del Modelo de Usuario//
const User = require('../src/models/user.model');

const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const port =  process.env.PORT || 3200;

/*Connect MultiParty*/
const fs = require('fs')
const path = require('path')

//Importación de las Rutas//
const userRoutes = require('../src/routes/user.routes');
const houseRoutes = require('../src/routes/house.routes');
const eventRoutes = require('../src/routes/event.routes');
const roomRoutes = require('../src/routes/room.routes');
const reservationRoutes = require('../src/routes/reservation.routes');
const contactRoutes = require('../src/routes/contact.routes')

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet({}));
app.use(cors());
app.use('/user', userRoutes);
app.use('/house', houseRoutes);
app.use('/event', eventRoutes);
app.use('/room', roomRoutes);
app.use('/reservation', reservationRoutes);
app.use('/contact', contactRoutes)


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

    //CREACION DE LA CARPETA POR ÚNICA VEZ//
    fs.mkdir(path.join(__dirname, '../uploads/users'),
        { recursive: true }, (err) => {
            if (err) {
                return console.error(err);
            }
            console.log('Directory created successfully!');
    });
});
