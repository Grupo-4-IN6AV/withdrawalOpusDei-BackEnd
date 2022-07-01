'use strict'

const Event = require('../models/event.model');
const House = require('../models/house.model');
const User = require('../models/user.model');
const { validateData } = require('../utils/validate');


//Función de Testeo//
exports.testEvent = (req, res) => 
{
    return res.send({message: 'Función de Testeo EVENTOS funciona correctamente.' });
}


//Función para agregar un evento
exports.saveEvent = async (req, res) => 
{
    try 
    {
        const params = req.body;
        const data = 
        {
            name: params.name,
            startDate: params.startDate,
            endDate: params.endDate,
            typeEvent: params.typeEvent,
            house: params.house,
            organizer: params.organizer,
            typePublic: params.typePublic
        };

        const msg = validateData(data);
        if (msg)
            return res.status(400).send(msg);

        const house = await House.findOne({ _id: params.house }); //Buscar la casa que se envia en parans
        if (!house) return res.status(400).send({ message: 'Casa de Retiros no Econtrada.' });
        
        const organizer = await User.findOne({$and:[{_id:params.organizer},{role:'ORGANIZADOR'}]});
        if(!organizer) return res.status(400).send({message: 'Organizad@r no Encontrado.'})


        //VERIFICAR QUE EL ORGANIZADOR SEA ADECUADO PARA EL TIPO DE PÚBLICO//

        //Eventos Femeninos
        if
        (
            (params.typePublic == 'Universitarias' || params.typePublic == 'Religiosas' || 
            params.typePublic == 'Estudiantes F' || params.typePublic == 'Señoras') && (organizer.gender == 'MASCULINO')
        )
        return res.status(400).send({message: 'El organizador de este evento no puede ser de género Masculino.'})
        
        //Eventos Masculinos
        if
        (
            (params.typePublic == 'Universitarios' || params.typePublic == 'Sacerdotes' || 
            params.typePublic == 'Estudiantes M' || params.typePublic == 'Señores') && (organizer.gender == 'FEMENINO')
        )
        return res.status(400).send({message: 'El organizador de este evento no puede ser de género Femenino.'})

        const eventAlready = await Event.findOne({
            $and: [
                    { house: data.house },
                    { name: data.name }
                ]
        });
        if (eventAlready) return res.status(400).send({ message: 'Evento ya Creado en esta Casa de Retiros.' });
        
        //MANEJO DE FECHAS//
        const actualDate = new Date();
        var monthActualDate = actualDate.getMonth()+1;
        var dayActualDate = actualDate.getDate();

        if (dayActualDate < 10) 
        {
            dayActualDate = '0' + dayActualDate;
        }
        if (monthActualDate < 10) 
        {
            monthActualDate = '0' + monthActualDate;
        }

        const stringActualDate = actualDate.getFullYear() + '-' + monthActualDate + '-' + dayActualDate

        const compareActualDate = new Date(stringActualDate);
        const compareParamsStartDate = new Date(params.startDate);
        const compareParamsEndDate = new Date(params.endDate);
        
        if(compareParamsStartDate < compareActualDate)
            return res.status(400).send({message:'La fecha de Inicio no es correcta.'})
        
        if(compareParamsEndDate < compareParamsStartDate)
            return res.status(400).send({message:'La fecha de Cierre no es correcta.'})

        const dateAlready = await Event.findOne({
                $and: [
                    { startDate: params.startDate },
                    { house: params.house }
                ]
            });
        
        const events = await Event.find({house: params.house});

        if(dateAlready) return res.status(400).send({message: 'Evento ya creado en esa fecha.'});
        
        for (let event of events)
        {
            if(compareParamsStartDate >= event.startDate && compareParamsStartDate <= event.endDate)
                return res.status(400).send({message: 'La Casa de Retiros no está Disponible en esa fecha.'})
            if(compareParamsEndDate >= event.startDate && compareParamsEndDate <= event.endDate)
                return res.status(400).send({message: 'La Casa de Retiros no está Disponible en esa fecha.'})
        }

        const evento = new Event(data);
        await evento.save();
        return res.send({message: 'Evento creado Exitosamente.', evento});
    } 
    catch (err) 
    {
        console.log(err);
        return res.status(500).send({ message: 'Error creando el Evento' });
    }
}

//Función para eliminar un evento//
exports.deleteEvent = async (req, res) => 
{
    try
    {
        const eventId = req.params.id;
        const eventoEliminado = await Event.findOneAndDelete({ _id: eventId });
        if (!eventoEliminado) 
        {
            return res.status(400).send({ message: 'Evento no Encotrado o ya Eliminado.' });
        } 
        else 
        {
            return res.send({message: 'Evento Eliminado Exitosamente.',eventoEliminado });
        }
    } 
    catch (err) 
    {
        console.log(err);
        return res.status(500).send({ message: 'Error Eliminado el Evento' });
    }
}

//Función para actualizar un evento//
exports.updateEvent = async (req, res) => 
{
    try 
    {
        const eventId = req.params.id;
        const params = req.body;
        
        const eventExist = await Event.findOne({_id: eventId});
        if(!eventExist) return res.status(400).send({message: 'Evento no Encontrado.'});

        const alreadyEventDate = await Event.findOne({$and:[{startDate: params.startDate},{_id:eventExist._id},{house:params.house}]});
        if(alreadyEventDate) 
            return res.status(400).send({message: 'Ya existe un evento creado en esa fecha y en esa casa'});
        let alreadyEventName = await Event.findOne({name: params.name});
        if(alreadyEventName && eventExist.nameEvent != params.nameEvent) 
        return res.status(400).send({message: 'Ya existe un evento con ese nombre.'});
            const eventoEditado = await Event.findOneAndUpdate({_id: eventId}, params, {new: true});
        return res.send({message: 'Evento Editado Exitosamente.', eventoEditado});
        
    } 
    catch (err) 
    {
        console.log(err);
        return res.status(500).send({ message: 'Error Editando el Evento' });
    }
}

//Función para mostrar todas los eventos//
exports.getEvents = async (req, res)=>
{
    try
    {
        const events = await Event.find();
        if (events.length == 0)
            return res.send({message: 'Aún no existen Eventos.'})
        return res.send({message: 'Eventos Encontrados:', events})
    }
    catch(err)
    {
        console.log(err); 
        return res.status(500).send({ message: 'Error obteniendo los Eventos.' });
    }
}

//Función para mostrar todas los eventos de un Organizador//
exports.getEventsForOrganizer = async (req, res)=>
{
    try
    {
        const events = await Event.find({organizer:req.user.sub});
        if (events.length == 0)
            return res.send({message: 'Aún no existen Eventos.'})
        return res.send({message: 'Eventos Encontrados:', events})
    }
    catch(err)
    {
        console.log(err); 
        return res.status(500).send({ message: 'Error obteniendo los Eventos.' });
    }
}


//Función para mostrar todas los eventos de una Casa//
exports.getEventsForHouse = async (req, res)=>
{
    try
    {
        const houseID = req.params.id

        const houseExist = await House.findOne({_id:houseID})

        if(!houseExist)
            return res.status(400).send({message:'Casa de Retiros no Encontrada.'})

        const events = await Event.find({house:houseID});
        if (events.length == 0)
            return res.send({message: 'Aún no existen Eventos en esta Casa.'})
        return res.send({message: 'Eventos Encontrados:', events})
    }
    catch(err)
    {
        console.log(err); 
        return res.status(500).send({ message: 'Error obteniendo los Eventos.' });
    }
}


//Función para mostrar un Evento//
exports.getEvent = async (req, res)=>{
    try
    {
        const eventId = req.params.id
        const evento = await Event.findOne({_id: eventId});
        if(!evento)
            return res.status(400).send({message:'Evento no Encontrado.'})
        return res.send({message: 'Evento Encontrado :', evento})
    }
    catch(err)
    {
        console.log(err); 
        return res.status(500).send({ message: 'Error obteniendo el Evento.' });
    }
}