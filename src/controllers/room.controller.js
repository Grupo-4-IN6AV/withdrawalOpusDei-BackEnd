'use strict'

const Room = require('../models/room.model');
const House = require('../models/house.model');

const { validateData } = require('../utils/validate');


//Función de Testeo//
exports.testRoom = (req, res) => 
{
    return res.send({message: 'Función de Testeo HABITACIONES funciona correctamente.' });
}


//Función para agregar una habitación
exports.saveRoom = async(req,res)=>
{
    try
    {
        const params = req.body;
        const data =
        {
            availability: true,
            quantityPeople: params.quantityPeople,
            name: params.name,
            house: params.house,
        };

        const msg = validateData(data);
        if(msg) return res.status(400).send(msg);

        const roomExist = await Room.findOne({name: params.name})
        if(roomExist)
            return res.status(400).send({message: 'La habitación ya existe.'});
        
        const houseExist = await House.findOne({_id: params.house});
        if(!houseExist)
            return res.status(400).send({message: 'Casa de Retiro no Encontrada.'})

        if (params.quantityPeople <= 0)
            return res.status(400).send({message:'La capacidad de la Habitación no es válida.'})

        const habitacion = new Room(data);
        await habitacion.save();
        return res.send({message: 'Habitación creada Exitosamente.',habitacion});
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).send({ message: 'Error creando la Habitación.' });
    }
}

//Función para eliminar una habitación//
exports.deleteRoom = async (req, res) => {
    try 
    {
        const roomID = req.params.id;
        const roomDeleted = await Room.findOneAndDelete({ _id: roomID });
        if (!roomDeleted) {
            return res.status(400).send({ message: 'Habitación no Encontrada o ya Eliminada' });
        } 
        else 
        {
            return res.send({message: 'Habitación Eliminada Exitosamente.',roomDeleted });
        }
    } 
    catch (err) 
    {
        console.log(err);
        return res.status(500).send({ message: 'Error eliminando la Habitación.' });
    }
}

//Función para actualizar una habitación//
exports.updateRoom = async (req, res) => {
    try 
    {
        const roomID = req.params.id;
        const params = req.body;

        const roomExist = await Room.findOne({_id: roomID});
        if(!roomExist) return res.status(400).send({message: 'Habitación no Encontrada.'});
        
        const alreadyName = await Room.findOne({name:params.name});
        if(alreadyName && roomExist.name != alreadyName.name) 
            return res.send({message: 'El nombre de la Habitación se encuentra en uso.'});

        const habitacionEditada = await Room.findOneAndUpdate({_id: roomID}, params, {new: true});
        if(!habitacionEditada) return res.status(400).send({message: 'Habitación no Editada.'});
        return res.send({message: 'Habitación Editada Exitosamente.', habitacionEditada});        
    } 
    catch (err) 
    {
        console.log(err);
        return res.status(500).send({ message: 'Error Editando la Habitación.' });
    }
}

//Función para mostrar todas las habitaciones//
exports.getRooms = async (req, res)=>
{
    try
    {
        const rooms = await Room.find();
        if(rooms.length == 0)
            return res.send({message: 'Aún no existen Habitaciones.'})
        return res.send({message: 'Habitaciones Econtradas:', rooms})
    }
    catch(err)
    {
        console.log(err); 
        return res.status(500).send({ message: 'Error obteniendo las Habitaciones.' });
    }
}

//Función para mostrar todas las habitaciones de una Casa//
exports.getRoomsForHouse = async (req, res)=>
{
    try
    {
        const houseID = req.params.id;

        const houseExist = await House.findOne({_id:houseID});

        if(!houseExist)
            return res.status(400).send({message:'Casa de Retiro no Encontrada.'});

        const rooms = await Room.find({house:houseID});
        if(rooms.length == 0)
            return res.send({message: 'Aún no existen Habitaciones en esta Casa de Retiros.'})
        return res.send({message: 'Habitaciones Econtradas:', rooms})
    }
    catch(err)
    {
        console.log(err); 
        return res.status(500).send({ message: 'Error obteniendo las Habitaciones.' });
    }
}

//Función para mostrar una habitación//
exports.getRoom = async (req, res)=>
{
    try
    {
        const roomID = req.params.id
        const habitacion = await Room.findOne({_id:roomID});
        if(!habitacion)
        return res.status(400).send({message:'Habitación no Encontrada.'});
        return res.send({message: 'Habitación Encontrada:', habitacion})
    }
    catch(err)
    {
        console.log(err); 
        return res.status(500).send({ message: 'Error obteniendo la Habitación.' });
    }
}