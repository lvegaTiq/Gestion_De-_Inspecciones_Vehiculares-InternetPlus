import Estado from "../../Models/Estado.js";
import Vehiculo from "../../Models/vehiculo.js";

export const getDataEstadoVehiculo = async (req, res) => {
  try {
    const { page = 1, limit = 300 } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: ["Vehiculo"],
    };

    const estados = await Estado.paginate({}, options);

    return res.status(200).json({
      success: true,
      message: "Consulta exitosa",
      data: estados,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Ocurrió un error al consultar",
      error: error.message,
    });
  }
};

export const postDataEstadoVehiculo = async (req, res) => {
  try {
    const {
      FechaEstado,
      kilometraje,
      Nivel,
      pedal,
      Luz,
      botiquin,
      varios,
      Observacion,
      vehiculoId,
    } = req.body;

    if (!vehiculoId) {
      return res.status(400).json({
        success: false,
        message: "Debe ingresar el id del vehiculo.",
      });
    }

    const vehiculoDoc = await Vehiculo.findById(vehiculoId);
    if (!vehiculoDoc) {
      return res.status(404).json({
        success: false,
        message: "Vehiculo no encontrado",
      });
    }

    const estadoVehiculo =
      Observacion && Observacion.trim() !== ""
        ? "Mal estado"
        : "Buen estado";

    const nuevoEstado = new Estado({
      FechaEstado,
      kilometraje,
      Nivel,
      pedal,
      Luz,
      botiquin,
      varios,
      Observacion,
      Vehiculo: vehiculoId,
    });

    await nuevoEstado.save();

    vehiculoDoc.estado = estadoVehiculo;
    await vehiculoDoc.save();

    return res.status(201).json({
      success: true,
      message: "El estado fue registrado correctamente",
      estadoVehiculo,
      data: nuevoEstado,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "No se puede crear el estado del vehiculo",
      error: error.message,
    });
  }
};
