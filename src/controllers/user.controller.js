'use strict'

const User = require('../models/user.model');

const { validateData, encrypt, checkPassword, checkUpdateAdmin } = require('../utils/validate');
const jwt = require('../services/jwt');


//Función de Testeo//
exports.testUser = (req, res) => 
{
    return res.send({message: 'Función de Testeo USUARIOS funciona correctamente.'});
}


//FUNCIÓN PARA CREAR ORGANIZADORES//
exports.saveOrganizers = async (req, res) => 
{
    try 
    {
        const params = req.body;

        //Parámetros Obligatorios//
        const data = 
        {
            name: params.name,
            surname: params.surname,
            password: params.password,
            username: params.username,
            age: params.age,
            role: 'ORGANIZADOR',
            gender: params.gender
        }

        const msg = validateData(data);
        if (msg) return res.status(400).send(msg);

        //Parámetros Opcionales
        data.email = params.email;
        data.phone = params.phone

        if (data.gender == 'MASCULINO' || data.gender == 'FEMENINO')
        {

            const existUser = await User.findOne({ username: params.username });
            
            if (!existUser && data.gender == 'MASCULINO')
            {
                if(data.gender == 'MASCULINO')
                {
                    data.password = await encrypt(params.password);
                    const organizador = new User(data);
                    await organizador.save();
                    return res.send({ message: 'Organizador registrado Existosamente.', organizador });
                }
                else if(data.gender == 'FEMENINO')
                {
                    data.password = await encrypt(params.password);
                    const organizadora = new User(data);
                    await organizadora.save();
                    return res.send({ message: 'Organizadora registrada Existosamente.', organizadora });
                }
            }
            else if(existUser && data.gender == 'MASCULINO')
            {     
                return res.status(400).send({ message: 'El nombre de usuario del Organizador ya Existe.' });
            }
            else if(existUser && data.gender == 'FEMENINO')
            {     
                return res.status(400).send({ message: 'El nombre de usuario de la Organizadora ya Existe.' });
            }
        }
        else
        {
            return res.status(400).send({ message: 'El Género ingresado no es válido.' });
        }
    } 
    catch (err) 
    {
        console.log(err);
        return res.status(500).send({ message: 'Error creando al Organizador' });
    }
}


//FUNCIÓN PARA ELIMINAR ORGANIZADOR//
exports.deleteOrganizer = async(req, res)=>
{
    try
    {
        const userId = req.params.id;

        const userExist = await User.findOne({_id: userId});
        if(!userExist) return res.status(400).send({message: 'Organizador No Encontrado.'});
        if(userExist.role === 'ADMINISTRADOR') 
            return res.status(400).send({message: 'No se puede eliminar al Administrador.'});
        const organizadorEliminado = await User.findOneAndDelete({_id: userId});
        if(!organizadorEliminado) return res.status(400).send({message: 'Organizador no Eliminado.'});
        return res.send({message: 'Organizador Eliminado Correctamente', organizadorEliminado})
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).send({err, message: 'Error al eliminar al Organizador'});
    }
}


//FUNCIÓN PARA ACTUALIZAR A LOS ORGANIZADORES//
exports.updateOrganizer = async(req, res)=>
{
    try
    {
        const userId = req.params.id;
        const params = req.body;

        const userExist = await User.findOne({_id: userId});
        if(!userExist) return res.status(400).send({message: 'Organizador no Encontrado.'});
        const emptyParams = await checkUpdateAdmin(params);
        if(emptyParams === false) return res.status(400).send({message: 'Parámetros Vacíos o no Editables'});
        if(userExist.role === 'ADMINISTRADOR') return res.status(400).send({message: 'No se puede Editar al Administrador.'});
        const alreadyUsername = await User.findOne({username:params.username});
        if(alreadyUsername && userExist.username != alreadyUsername.username) return res.send({message: 'El nombre de usuario se encuentra en uso.'});
        if(params.gender != 'MASCULINO' && params.gender != 'FEMENINO') return res.status(400).send({message: 'El Género ingresado no es válido.'});
        const organizadorEditado = await User.findOneAndUpdate({_id: userId}, params, {new: true});
        if(!organizadorEditado) return res.status(400).send({message: 'Organizador no Editado.'});
        return res.send({message: 'Organizador Editado Exitosamente.', organizadorEditado});
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).send({err, message: 'Error al Editar al Organizador.'});
    }
}


//OBTENER UN ORGANIZADOR//
exports.getOrganizer = async (req , res) =>
{
    try 
    {
        const userID = req.params.id
        
        const organizador = await User.findOne({$and:[{_id:userID},{role: 'ORGANIZADOR'}]})
        if(organizador)
            return res.send({message:'Organizador Encontrado:', organizador})
        return res.status(400).send({message:'Organizador no Encontrado.'})
    } 
    catch (err) 
    {
        console.log(err);
        return res.status(500).send({ err, message: 'Error Al Obtener al Organizador.' });
    }
}


//OBTENER TODOS LOS ORGANIZADORES//
exports.getOrganizers = async (req , res) =>
{
    try 
    {
        const organizadores = await User.find({role: 'ORGANIZADOR'})
        if(organizadores.length !== 0)
            return res.send({message:'Organizadores Encontrados:', organizadores})
        return res.status(400).send({message:'Aún no existen Organizadores registrados.'})
    } 
    catch (err) 
    {
        console.log(err);
        return res.status(500).send({ err, message: 'Error Al Obtener a los Organizadores.' });
    }
}


//OBTENER TODOS LOS POR GÉNERO//
exports.getOrganizersForGender = async (req , res) =>
{
    try 
    {
        const params = req.body;
        const gender = params.gender
        const organizadores = await User.find({$and:[{role: 'ORGANIZADOR'},{gender: 'MASCULINO'}]})
        const organizadoras = await User.find({$and:[{role: 'ORGANIZADOR'},{gender: 'FEMENINO'}]})
        if(organizadores.length !== 0 && gender == 'MASCULINO')
            return res.send({message:'Organizadores Encontrados:', organizadores})
        if(organizadores.length !== 0 && gender == 'FEMENINO')
            return res.send({message:'Organizadoras Encontradas:', organizadoras})
        return res.status(400).send({message:'Aún no existen Organizadores registrados.'})
    } 
    catch (err) 
    {
        console.log(err);
        return res.status(500).send({ err, message: 'Error Al Obtener a los Organizadores.' });
    }
}


//INICIAR SESIÓN//
exports.login = async (req, res) => 
{
    try 
    {
        const params = req.body;
        let data = 
        {
            username: params.account,
            password: params.password
        }
        let msg = validateData(data);

        if (!msg) 
        {
            let userExist = await User.findOne({$or:
                [{username:params.account},{email:params.account}]});
            if (userExist && await checkPassword(params.password, userExist.password)) {
                const token = await jwt.createToken(userExist);
                return res.send({ token, message: 'Sesión Iniciada.' });
            } 
            else 
            {
                return res.send({ message: 'Credenciales Inválidas.' });
            }
        } 
        else 
        {
            return res.status(400).send(msg);
        }
    } 
    catch (err) 
    {
        console.log(err);
        return res.status(500).send({ err, message: 'Error Al Iniciar Sesión' });
    }
}
