'use strict'

const bcrypt = require('bcrypt-nodejs');


exports.validateData = (data) => {
    let keys = Object.keys(data), msg = '';

    for (let key of keys) {
        if (data[key] !== null && data[key] !== undefined && data[key] !== '' && data[key] !== "null" && data[key] !== "undefined") continue;
        msg += `El parámetro ${key} es requerido.\n`
    }
    return msg.trim();
}

exports.encrypt = async (password) => 
{
    try {
        return bcrypt.hashSync(password);
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.checkPassword=async(password, hash)=>
{
    try
    {
        return bcrypt.compareSync(password,hash);
    }
    catch(err)
    {
        console.log(err);
        return err;
    }
}

exports.checkUpdateAdmin = async(data)=>{
    if(data.password ||
       Object.entries(data).length === 0){
        return false;
    }else{
        return true;
    }
}

exports.checkPermission = async (userId, sub)=>
{
    try
    {
        if(userId != sub)
        {
            return false;
        }
        else
        {
            return true;
        }
    }
    catch(err)
    {
        console.log(err);
        return err;
    }
}

exports.validExtension = async (ext, filePath) => 
{
    try 
    {
        if (ext == 'png' ||
            ext == 'jpg' ||
            ext == 'jpeg' ||
            ext == 'gif') 
            {
            return true;

        } else {

            fs.unlinkSync(filePath);

            return false;

        }
    } 
    catch (err) 
    {
        console.log(err);
        return err;
    }
}