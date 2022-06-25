'use strict'

const Reservation = require('../models/reservation.model');
const Room = require('../models/room.model');
const Event = require('../models/event.model');
const User = require('../models/user.model');

const { validateData } = require('../utils/validate');


//Función de Testeo//
exports.testReservation = (req, res) => 
{
    return res.send({message: 'Función de Testeo RESERVACIONES funciona correctamente.' });
}


//Función para enviar una reservación
exports.saveReservation = async (req, res) => 
{
    try 
    {
        const params = req.body;
        const data = 
        {
            date: new Date(),
            room: params.room,
            client: params.client,
            age: params.age,
            event: params.event,
            gender: params.gender,
        };
        
        if (params.age < 18)
            data.DPI = ' ';
        
        const msg = validateData(data);
            if (msg) return res.status(400).send(msg);

        const dateLocal = (data.date).toLocaleString('UTC',{timeZone: 'America/Guatemala'});
        const splitDate = dateLocal.split(' ');
        const splitDateOne = splitDate[0].split('/');

        if (splitDateOne[0] < 10) 
        {
            splitDateOne[0] = '0' + splitDateOne[0];
        }
        if (splitDateOne[1] < 10) 
        {
            splitDateOne[1] = '0' + splitDateOne[1];
        }

        const setDate = 
        splitDateOne[2] + '-' + splitDateOne[1] + '-' + splitDateOne[0] +
            'T' + splitDate[1] + '.000Z';

        const newDataDate = new Date(setDate)
        data.date = newDataDate;

        //Verificar la Habitación//
        const verificRoom = await Room.findOne({_id: params.room})
        if(!verificRoom)
            return res.status(400).send({message:'Habitación no Encontrada.'});

        //Verificar la Disponibilidad//
        if(verificRoom.availability == false)
            return res.status(400).send({message:'Habitación no Disponible.'});

        //Verificar el Evento//
        const verificEvent = await Event.findOne({_id: params.event})
        if(!verificEvent)
            return res.status(400).send({message:'Evento no Encontrado.'});

        //Verificar acceso al Evento//
        const accessEvent = verificEvent.organizer;
        const genderAccess = await User.findOne({_id:accessEvent})

        if(genderAccess.gender !== params.gender)
            return res.status(400).send({message:'No puedes asistir a este Evento.'})
        
        //Actualizar Estado de las Habitaciones//
        const updateQuantityPeople = await Room.findOneAndUpdate(
            {_id:params.room},
            { $inc: { quantityPeople: -1 } },
            {new: true}
            )

        if (updateQuantityPeople.quantityPeople == 0)
            var updateAvailability = await Room.findOneAndUpdate(
                {_id:params.room},{availability:false},{new:true})
        

        const reservacion = new Reservation(data);
        await reservacion.save();
        return res.send({message: 'Reservación creada Exitosamente.', reservacion});     
    } 
    catch (err) 
    {
        console.log(err);
        return res.status(500).send({ message: 'Error creando la Reservación.' });
    }
}

