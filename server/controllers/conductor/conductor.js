import { populate } from 'dotenv';
import Conductor from '../../Models/conductor.js'

export const getDataConductor = async(req, res)=>{
    try{

        const {page=1, limit=300} = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit), 
            sort: { createdAt: -1},
        }

        const resultado = await Conductor.paginate({}, options);
        res.status(200).json({
            success: true,
            data: resultado
        })
    }catch(error){
        res.status(500).json({
            succes: false,
            message: `Error al momento de cosultar el conductor`,
            error: error.message
        })
    }
}

export const postDataConductor= async(req,res)=>{
    try{
        if (!req.body || Object.keys(req.body).length === 0) {
          return res.status(400).json({
            success: false,
            message: "Body vacío"
          });
        }

        const {
            nombre, 
            apellido, 
            tipoDocumento, 
            numDoc, 
            numTel,
            estado
        } = req.body

        let licenciaPath = null
        if(req.file){
            licenciaPath = `/uploads/conductores/${req.file.filename}`
        }
        const existingConductor = await conductor.findOne({$or: [{numDoc}]})

        if(existingConductor){
            res.status(500).json({
                message: `Este conductor con documento ${numDoc} ya existe`
            })
        }

        const newConductor = new conductor({
            nombre,
            apellido,
            tipoDocumento,
            numDoc,
            numTel,
            licencia: licenciaPath,
            estado
        })

        await newConductor.save()

        res.status(200).json({
            succes: true,
            message: `Conductor creado exitosamente`,
            data: newConductor
        })
    }catch(error){
        re.status(500).json({
            succes: false,
            message: 'No se pudo crear el conductor',
            error: error.message
        })
    }
}

export const uploadDataConductor = async(req, res)=>{
    try{

    }catch(error){

    }
}

export const InactivarDataConductor = async(req, res)=>{
    try{

    }catch(error){
        
    }
}