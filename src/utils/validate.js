'use strict'

const bcrypt = require('bcrypt-nodejs');


exports.validateData = (data) => {
    let keys = Object.keys(data), msg = '';

    for (let key of keys) {
        if (data[key] !== null && data[key] !== undefined && data[key] !== '' && data[key] !== "null" && data[key] !== "undefined") continue;
        msg += `The params ${key} is required.\n`
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
    if(data.password || data.role ||
       Object.entries(data).length === 0){
        return false;
    }else{
        return true;
    }
}