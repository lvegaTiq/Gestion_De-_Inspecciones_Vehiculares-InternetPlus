import propietario from "../../Models/propietario.js";


export const getDataPropietario = async(req, res) =>{
    try{
        const {page = 1, limit = 300} = req.query; 
        const options = {
            page: parseInt(page),
            limit: parseInt(limit), 
            sort: { createdAt: -1}
        }

        const propietarios = await propietario.paginate({},options);

        res.status(200).json({
            succes: true,
            data: propietarios
        })
    }catch(error){
        res.status(500).json({
            succes: false,
            message: 'Error al consultar los datos del propietario',
            error: error.message
        })
    }
}

export const postDataPropietario = async(req, res) => {
    try{
        const {nombre, apellido, tipoDoc, numDoc, numTel, estado} = req.body
        const existinPropietario = await propietario.findOne({$or: [{numDoc}]})
        if(existinPropietario){
            res.status(404).json({
                succes: false,
                message: `El propietario con ${tipoDoc} ${numDoc} ya existe`
            })
        }

        const nuevoPropietario = new propietario({
            nombre,
            apellido,
            tipoDoc,
            numDoc,
            numTel,
            estado
        })

        await nuevoPropietario.save();

        res.status(200).json({
            success: true,
            message: 'Propietario creado correctamente',
            data: nuevoPropietario
        })
    }catch(error){
        res.status(500).json({
            succes: false,
            message: 'No se puede consultar el propietario',
            error: error.message
        })
    }
}

export const uploadDataPropietario = async(req, res)=>{
    try{

    }catch(error){

    }
}

export const InactivarDataPropietario = async(req, res)=>{
    try{

    }catch(error){
        
    }
}