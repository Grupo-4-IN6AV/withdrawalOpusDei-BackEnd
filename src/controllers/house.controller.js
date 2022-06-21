'use strict'

const House = require('../models/house.model');

const { validateData, checkUpdateAdmin } = require('../utils/validate');

//Función de Testeo//
exports.testHouse = (req, res) => 
{
    return res.send({message: 'Función de Testeo CASAS funciona correctamente.' });
}


//Función para agregar una nueva casa//
exports.saveHouse = async (req, res) => 
{
    try 
    {
        const params = req.body;
        const data = 
        {
            name: params.name,
            country: params.country,
            township: params.township,
            address: params.address,
        };

        const msg = validateData(data);
        if (msg)
            return res.status(400).send(msg);

        const existHouse = await House.findOne({ name: params.name });
        if (!existHouse) 
        {
            const house = new House(data);
            await house.save();
            return res.send({ message: 'Casa de Retiro creada Exitosamente.', house });
        }
        else return res.status(400).send({ message: 'La casa de Retiro ya existe.' });

    } 
    catch (err) 
    {
        console.log(err);
        return res.status(500).send({ message: 'Error creando la CASA' });
    }

}

//Función para eliminar una casa//
exports.deleteHouse = async (req, res) => 
{
    try 
    {
        const houseId = req.params.id;
        const casaEliminada = await House.findOneAndDelete({ _id: houseId });
        if (!casaEliminada) 
        {
            return res.status(500).send({ message: 'Casa de Retiro no Encontra o ya Eliminada.' });
        } 
        else 
        {
            return res.send({ casaEliminada, message: 'Casa de Retiro Eliminada Con Éxito.' });
        }
    } 
    catch (err) 
    {
        console.log(err);
        return res.status(500).send({ message: 'Error eliminando la Casa.' });
    }

}


//Función para actualizar una casa//
exports.updateHouse = async (req, res) => 
{
    try 
    {
        const houseId = req.params.id;
        const params = req.body;

        const houseExist = await House.findOne({_id: houseId});
        if(!houseExist) return res.status(400).send({message: 'Casa de Retiro no Encontrada.'});
        
        const alreadyName = await House.findOne({name:params.name});
        if(alreadyName && houseExist.name != alreadyName.name) 
            return res.send({message: 'El nombre de la Casa de Retiro se encuentra en uso.'});

        const casaEditada = await House.findOneAndUpdate({_id: houseId}, params, {new: true});
        if(!casaEditada) return res.status(400).send({message: 'Casa de Retiro no Editada.'});
        return res.send({message: 'Casa de Retiro Editada Exitosamente.', casaEditada});
    } 
    catch (err) 
    {
        console.log(err);
        return res.status(500).send({ message: 'Error editando la Casa.' });
    }
}


//Función para mostrar todas las casas//
exports.getHouses = async (req, res)=>
{
    try
    {
        const casas = await House.find();
        if(!casas)
            return res.send({message: 'Aún no existen Casas de Retiro.'})
        return res.send({message: 'Casas de Retiro Encontradas:', casas})
    }
    catch(err)
    {
        console.log(err); 
        return res.status(500).send({ message: 'Error obteniendo las Casas.' });
    }
}


//Función para mostrar una casa//
exports.getHouse = async (req, res)=>
{
    try
    {
        const housesId = req.params.id
        const casa = await House.findOne({_id: housesId});
        if(!casa)
            return res.send({message: 'Casa de Retiro no Encontrada.'})
        return res.send({message: 'Casa de Retiro Encontrada:', casa})
    }
    catch(err)
    {
        console.log(err); 
        return res.status(500).send({ message: 'Error obteniendo la Casa.' });
    }
}