import conductor from '../../Models/conductor.js'

export const getDataConductor = async(req, res)=>{
    try{

        const {page=1, limit=300} = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit), 
            sort: { createdAt: -1}
        }

        const conductor = await conductor.paginate({}, options);
        res.status(200).json({
            success: true,
            data:conductor
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

        const {nombre, apellido, tipoDocumento, numDoc, numTel, licencia} = req.body
    }catch(error){

    }
}