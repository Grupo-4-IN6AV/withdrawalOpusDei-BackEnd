'use strict'

const User = require('../models/user.model');

const 
{ 
    validateData, encrypt, 
    checkPassword, checkUpdateAdmin, 
    checkPermission, validExtension 
} = require('../utils/validate');
const jwt = require('../services/jwt');

//Connect Multiparty Upload Image//
const fs = require('fs');
const path = require('path');

//Función de Testeo//
exports.testUser = (req, res) => 
{
    return res.send({message: 'Función de Testeo USUARIOS funciona correctamente.'});
}


//FUNCIÓN PARA CREAR ORGANIZADORES//
exports.saveUser = async (req, res) => 
{
    try 
    {
        const params = req.body;

        //Parámetros Obligatorios//
        const dataSpanish = 
        {
            nombre: params.name,
            apellido: params.surname,
            contraseña: params.password,
            usuario: params.username,
            email: params.email,
            teléfono: params.phone,
            edad: params.age,
            role: params.role,
            género: params.gender
        }

        const data = 
        {
            name: params.name,
            surname: params.surname,
            password: params.password,
            username: params.username,
            email: params.email,
            phone: params.phone,
            age: params.age,
            role: params.role,
            gender: params.gender
        }

        const msg = validateData(dataSpanish);
        if (msg) return res.status(400).send(msg);

        const existUser = await User.findOne({ username: params.username });
            
        if (!existUser)
        {
               
            data.password = await encrypt(params.password);
            const user = new User(data);
            await user.save();
            return res.send({ message: 'Usuario registrado Existosamente.', user }); 
        }
        else if(existUser && data.gender == 'MASCULINO')
        {     
            return res.status(400).send({ message: 'El nombre de usuario ya Existe.' });
        }
    } 
    catch (err) 
    {
        console.log(err);
        return res.status(500).send({ message: 'Error creando al Usuario' });
    }
}


//FUNCIÓN PARA ELIMINAR ORGANIZADOR//
exports.deleteUser = async(req, res)=>
{
    try
    {
        const userId = req.params.id;

        const userExist = await User.findOne({_id: userId});
        if(!userExist) return res.status(400).send({message: 'Organizador No Encontrado.'});
        if(userExist.role === 'ADMINISTRADOR') 
            return res.status(400).send({message: 'No se puede eliminar al Administrador.'});
        const userDeleted = await User.findOneAndDelete({_id: userId});
        if(!userDeleted) return res.status(400).send({message: 'Usuario no Eliminado.'});
        return res.send({message: 'Usuario Eliminado Correctamente', userDeleted})
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).send({err, message: 'Error al eliminar al Usuario'});
    }
}


//FUNCIÓN PARA ACTUALIZAR A LOS ORGANIZADORES//
exports.updateUser = async(req, res)=>
{
    try
    {
        const userId = req.params.id;
        const params = req.body;

        const userExist = await User.findOne({_id: userId});
        if(!userExist) return res.status(400).send({message: 'Usuario no Encontrado.'});
        const emptyParams = await checkUpdateAdmin(params);
        if(emptyParams === false) return res.status(400).send({message: 'Parámetros Vacíos o no Editables'});
        if(userExist.role === 'ADMINISTRADOR') return res.status(400).send({message: 'No se puede Editar al Administrador.'});
        const alreadyUsername = await User.findOne({username:params.username});
        if(alreadyUsername && userExist.username != alreadyUsername.username) 
            return res.status(400).send({message: 'El nombre de usuario se encuentra en uso.'});
        const userUpdate = await User.findOneAndUpdate({_id: userId}, params, {new: true});
        if(!userUpdate) return res.status(400).send({message: 'Usuario no Editado.'});
        return res.send({message: 'Usuario Editado Exitosamente', userUpdate});
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).send({err, message: 'Error al Editar al Usuario.'});
    }
}


//OBTENER UN ORGANIZADOR//
exports.getUser = async (req , res) =>
{
    try 
    {
        const userID = req.params.id
        
        const user = await User.findOne({_id:userID})
        if(user)
            return res.send({message:'Usuario Encontrado:', user})
        return res.status(400).send({message:'Usuario no Encontrado.'})
    } 
    catch (err) 
    {
        console.log(err);
        return res.status(500).send({ err, message: 'Error Al Obtener al Usuario.' });
    }
}


//OBTENER TODOS LOS ORGANIZADORES//
exports.getUsers = async (req , res) =>
{
    try 
    {
        const users = await User.find({role:{$ne:'ADMINISTRADOR'}})
        return res.send({message:'Organizadores Encontrados:', users})
    } 
    catch (err) 
    {
        console.log(err);
        return res.status(500).send({ err, message: 'Error Al Obtener a los Organizadores.' });
    }
}


//BUSCAR ORGANIZADOR - PIPE//
exports.searchUsers = async (req , res) =>
{
    try
    {
        const params = req.body;
        var users;
        users = await User.find(
            {
                name: { $regex: params.name, $options: 'i' },
            }
        );
        if(users.length === 0)
        users = await User.find(
            {
                surname: { $regex: params.name, $options: 'i' },
            }
        );        
        if(users.length === 0)
        users = await User.find(
            {
                username: { $regex: params.name, $options: 'i' },
            }
        );
        if(users.length === 0)
        users = await User.find(
            {
                role: { $regex: params.name, $options: 'i' },
            }
        ); 
        return res.send({ message: 'Users:', users })
    } 
    catch (err) 
    {
        console.log(err);
        return err;
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
            username: params.username,
            password: params.password
        }
        let msg = validateData(data);

        if (!msg) 
        {
            let userExist = await User.findOne({$or:
                [{username:params.username},{email:params.username}]});
            if (userExist && await checkPassword(params.password, userExist.password)) {
                const token = await jwt.createToken(userExist);
                return res.send({ token, message: 'Sesión Iniciada.', userExist });
            } 
            else 
            {
                return res.status(400).send({ message: 'Credenciales Inválidas.' });
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


//CONTROL DE TABLAS//

exports.getUsersNameUp = async(req, res)=>{
    try
    {
        const users = await User.find({$or:[{role:'CLIENTE'},{role:'ORGANIZADOR'}]}).sort({name: 'asc'});
        return res.send({users});
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send({ message: 'Error getting Users.', err});
    }
}


exports.getUsersNameDown = async(req, res)=>
{
    try
    {
        const users = await User.find({$or:[{role:'CLIENTE'},{role:'ORGANIZADOR'}]}).sort({name: 'desc'});
        return res.send({users});   
    }
    catch(err){
        console.log(err)
        return res.status(500).send({ message: 'Error getting Users.', err});
    }
}


exports.getUsersSurnameUp = async(req, res)=>{
    try
    {
        const users = await User.find({$or:[{role:'CLIENTE'},{role:'ORGANIZADOR'}]}).sort({surname: 'asc'});
        return res.send({users});
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send({ message: 'Error getting Users.', err});
    }
}


exports.getUsersSurnameDown = async(req, res)=>
{
    try
    {
        const users = await User.find({$or:[{role:'CLIENTE'},{role:'ORGANIZADOR'}]}).sort({surname: 'desc'});
        return res.send({users});   
    }
    catch(err){
        console.log(err)
        return res.status(500).send({ message: 'Error getting Users.', err});
    }
}


exports.getUsersUsernameUp = async(req, res)=>
{
    try
    {
        const users = await User.find({$or:[{role:'CLIENTE'},{role:'ORGANIZADOR'}]}).sort({username: 'asc'});
        return res.send({users});   
    }
    catch(err){
        console.log(err)
        return res.status(500).send({ message: 'Error getting Users.', err});
    }
}


exports.getUsersUsernameDown = async(req, res)=>
{
    try
    {
        const users = await User.find({$or:[{role:'CLIENTE'},{role:'ORGANIZADOR'}]}).sort({username: 'desc'});
        return res.send({users});   
    }
    catch(err){
        console.log(err)
        return res.status(500).send({ message: 'Error getting Users.', err});
    }
}


exports.getUsersAgeUp = async (req, res) =>
{
    try
    {
        const users = await User.find({$or:[{role:'CLIENTE'},{role:'ORGANIZADOR'}]});
        users.sort((a,b) =>{ return b.age-a.age;});
        return res.send({users});
    }
    catch(err)
    {
        console.log(err);
        return err;
    }
}


exports.getUsersAgeDown = async (req, res) =>
{
    try
    {
        const users = await User.find({$or:[{role:'CLIENTE'},{role:'ORGANIZADOR'}]});
        users.sort((a,b) =>{ return a.age-b.age;});
        return res.send({users});
    }
    catch(err)
    {
        console.log(err);
        return err;
    }
}

//CARGA DE IMAGENES//
exports.addImageUser=async(req,res)=>
{
    try
    {
        const userID = req.params.id;

        const permission = await checkPermission(userID, req.user.sub);
        if(permission === false) return res.status(401).send({message: 'You dont have permission to update this User.'});
        const alreadyImage = await User.findOne({_id: req.user.sub});
        let pathFile = './uploads/users/';
        if(alreadyImage.image) fs.unlinkSync(pathFile+alreadyImage.image);
        if(!req.files.image || !req.files.image.type) return res.status(400).send({message: 'Havent sent image'});
        
        const filePath = req.files.image.path; 
       
        const fileSplit = filePath.split('\\'); 
        const fileName = fileSplit[2]; 

        const extension = fileName.split('\.'); 
        const fileExt = extension[1]; 

        const validExt = await validExtension(fileExt, filePath);
        if(validExt === false) return res.status(400).send('Invalid extension');
        const updateUser = await User.findOneAndUpdate({_id: req.user.sub}, {image: fileName}, {new: true}).lean();        if(!updateUser) return res.status(404).send({message: 'User not found'});
        
        if(!updateUser) return res.status(404).send({message: 'User not found'});
        delete updateUser.password;
        console.log(updateUser.image)
        var imageAsBase64 = await  fs.readFileSync(`./uploads/${updateUser.image}`, {encoding: 'base64'});
        console.log(imageAsBase64)
        return res.send(updateUser);
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).send({err, message: 'Error Add Image User Company'});
    }
}

exports.getImageUser = async(req, res)=>
{
    try
    {
        const fileName = req.params.fileName;
        const pathFile = './uploads/users/' + fileName;

        const image = fs.existsSync(pathFile);
        if(!image) return res.status(404).send({message: 'Image not found'});
        return res.sendFile(path.resolve(pathFile));
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).send({err, message: 'Error getting image'});
    }
}