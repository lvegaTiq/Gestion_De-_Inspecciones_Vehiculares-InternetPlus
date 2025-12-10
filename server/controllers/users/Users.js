import mongoose from "mongoose";
import user from '../../Models/users.js'

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
            data: users
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
        console.log("BODY:", req.body);

        if (!req.body || Object.keys(req.body).length === 0) {
          return res.status(400).json({
            success: false,
            message: "Body vacío"
          });
        }


        const {nombre, apellido, tipoDocumento, documento, email, estado, telefono, password, role} = req.body;
        const existingUser = await user.findOne({$or: [{email}, {documento}]}); 

        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "El usuario ya existe en la base de datos"
            })
        }
        if (!documento || documento.trim() === "") {
          return res.status(400).json({
            success: false,
            message: "Documento obligatorio"
          });
        }


        const newUser = new user({
            nombre,
            apellido,
            tipoDocumento,
            documento,
            email,
            estado,
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

export const actualizar = async(req, res) =>{
    try{
        const { id } = req.params;
        const {
            nombre,
            apellido,
            tipoDocumento,
            documento,
            email,
            estado,
            telefono,
            password,
            role
        } = req.body

        const dataupdate = {}
        if(nombre){
            dataupdate.nombre = nombre
        }
        if(apellido){
            dataupdate.apellido = apellido
        }
        if(tipoDocumento){
            dataupdate.tipoDocumento = tipoDocumento
        }
        if(documento){
            dataupdate.documento = documento
        }
        if(email){
            dataupdate.email = email
        }
        if(estado){
            dataupdate.estado = estado
        }
        if(telefono){
            dataupdate.telefono = telefono
        }
        if(password){
            dataupdate.password = password
        }
        if(role){
            dataupdate.role = role
        }

        const usuarioActualizar = await user.findByIdAndUpdate(
            id,
            dataupdate,
            {new: true}
        )

        if(!usuarioActualizar){
            return res.status(404).json({
                success: false,
                message: 'Propioetario no encontrado'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Usuario actualizado correctamente',
            data: usuarioActualizar   
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: `Error al momento de actualizar los datos`,
            error: error.message
        })
    }
} 

export const inactivarUsuario = async(req,res)=>{
    try{
        const {id} = req.params;
        const  {estado} = req.body
        const actualizarUser = await user.findByIdAndUpdate(
            id,
            {estado: estado},
            {new: true}
        )

        if(!actualizarUser){
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Cambio de estado exitoso',
            data: actualizarUser
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: `No se pudo inactivar el usuario `
        })
    }
}