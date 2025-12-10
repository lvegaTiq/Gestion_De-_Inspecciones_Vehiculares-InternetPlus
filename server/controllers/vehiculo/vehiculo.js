import Vehiculo from "../../Models/vehiculo.js";

export const getDataVehiculo = async (req, res) => {
  try {
    const { page = 1, limit = 300 } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: ["propietario", "conductor"],
    };

    const vehiculos = await Vehiculo.paginate({}, options);

    return res.status(200).json({
      success: true,
      message: "Consulta exitosa",
      data: vehiculos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "No se puede consultar los datos",
      error: error.message,
    });
  }
};

export const postDataVehiculo = async (req, res) => {
  try {
    const {
      tipoVehiculo,
      placa,
      modelo,
      fechaSoat,
      fechaTecno,
      propietarioId,
      conductorId,
      estado,
    } = req.body;

    const exitingVehiculo = Vehiculo.findOne({$or:[{placa}]});
    if(!exitingVehiculo){
        res.status(404).json({
            success: false,
            message: `El vehiculo con placa: ${placa} ya existe en la base de datos`
        })
    }

    if (!propietarioId || !conductorId) {
      return res.status(400).json({
        success: false,
        message: "Debes seleccionar un propietario y un conductor",
      });
    }

    const nuevoVehiculo = new Vehiculo({
      tipoVehiculo,
      placa,
      modelo,
      fechaSoat,
      fechaTecno,
      propietario: propietarioId,
      conductor: conductorId,
      estado,
      estadoVehiculo: 'Activo'
    });

    await nuevoVehiculo.save();

    return res.status(201).json({
      success: true,
      message: "Vehículo registrado correctamente",
      data: nuevoVehiculo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Hubo un error al crear un vehículo nuevo",
      error: error.message,
    });
  }
};

export const updateVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      tipoVehiculo,
      placa,
      modelo,
      fechaSoat,
      fechaTecno,
      propietarioId,
      conductorId,
      estado,
      estadoVehiculo,
    } = req.body;

    const dataToUpdate = {};

    if (tipoVehiculo) dataToUpdate.tipoVehiculo = tipoVehiculo;
    if (placa) dataToUpdate.placa = placa;
    if (modelo) dataToUpdate.modelo = modelo;
    if (fechaSoat) dataToUpdate.fechaSoat = fechaSoat;
    if (fechaTecno) dataToUpdate.fechaTecno = fechaTecno;
    if (propietarioId) dataToUpdate.propietario = propietarioId;
    if (conductorId) dataToUpdate.conductor = conductorId;
    if (estado) dataToUpdate.estado = estado;
    if (estadoVehiculo) dataToUpdate.estadoVehiculo = estadoVehiculo;

    const vehiculoActualizado = await Vehiculo.findByIdAndUpdate(
      id,
      dataToUpdate,
      { new: true }
    )
      .populate("propietario")
      .populate("conductor");

    if (!vehiculoActualizado) {
      return res.status(404).json({
        success: false,
        message: "Vehículo no encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehículo actualizado correctamente",
      data: vehiculoActualizado,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar el vehículo",
      error: error.message,
    });
  }
};


export const CambioEstadoVehiculo = async(req, res)=>{
    try{
        const {id} = req.params;
        const {estado} = req.body;
        
        const estadosPermitidos = ['Buen estado', 'Mal estado', 'Pendiente'];

        if(!estadosPermitidos.includes(estado)){
            return res.status(400).json({
              success: false,
              message: "Estado inválido. Use 'Buen estado', 'Mal estado' o 'Pendiente'",
            });
        }

        const vehiculo = await Vehiculo.findByIdAndUpdate(
            id,
            {estado},
            {new:true}
        )
        .populate("propietario")
        .populate("conductor")

        if(!vehiculo){
            return res.status(400).json({
                success: false,
                message: `Vehiculono encontrado`
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Estado actualizado correctamente',
            data: vehiculo
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: `Error al carbial el estado del vehiculo`, 
            error: error.message
        })
    }
}



export const activarVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; 

    const vehiculo = await Vehiculo.findByIdAndUpdate(
      id,
      { estadoVehiculo: estado },
      { new: true }
    )
      .populate("propietario")
      .populate("conductor");

    if (!vehiculo) {
      return res.status(404).json({
        success: false,
        message: "Vehículo no encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehículo activado correctamente",
      data: vehiculo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al activar el vehículo",
      error: error.message,
    });
  }
};
