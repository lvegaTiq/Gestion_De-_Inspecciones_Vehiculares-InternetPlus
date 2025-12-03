import mongoose from "mongoose";
import user from '../Models/users.js'

export const getData = async(req, res )=>{
    try{
        const {page = 1, limit = 300} = req.query; 
        const options = {
            page: parseInt(page),
            limit: parseInt(limit), 
            sort: { createdAt: -1}
        }

        const users = await user.paginate({}, options)

        res.status(200).json({
            success: true,
            data:users
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: `Error al consultar los usuarios registrados`,
            error: error.message
        })
    }
}

export const create = async(req, res)=>{
    try{
        if (Object.keys(req.body).length === 0) {
          return res.status(400).json({
            success: false,
            message: "Body vacío"
          });
        }

        const {nombre, apellido, tipoDocumento, documento, email, telefono, password, role} = req.body;
        const existingUser = await user.findOne({$or: [{email}, {documento}]}); 

        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "El usuario ya existe en la base de datos"
            })
        }

        const newUser = new user({
            nombre,
            apellido,
            tipoDocumento,
            documento,
            email,
            telefono,
            password,
            role
        })

        await newUser.save();
        res.status(200).json({
          success: true,
          data: newUser,
          message: 'Usuario creado exitosamente'  
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'El usuario no se pudo crear',
            error: error.message
        })
    }
}