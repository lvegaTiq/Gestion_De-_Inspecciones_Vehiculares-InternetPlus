import Conductor from "../../Models/conductor.js";

export const getDataConductor = async (req, res) => {
  try {
    const { page = 1, limit = 300 } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
    };

    const resultado = await Conductor.paginate({}, options);

    return res.status(200).json({
      success: true,
      data: resultado,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al momento de consultar el conductor",
      error: error.message,
    });
  }
};

export const postDataConductor = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Body vacío",
      });
    }

    const { nombre, apellido, tipoDocumento, numDoc, numTel, estado } = req.body;

    let licenciaPath = null;
    if (req.file) {
      licenciaPath = `/uploads/conductores/${req.file.filename}`;
    }

    const existingConductor = await Conductor.findOne({ numDoc });

    if (existingConductor) {
      return res.status(400).json({
        success: false,
        message: `Este conductor con documento ${numDoc} ya existe`,
      });
    }

    const newConductor = new Conductor({
      nombre,
      apellido,
      tipoDocumento,
      numDoc,
      numTel,
      licencia: licenciaPath,
      estado: estado || "Activo",
    });

    await newConductor.save();

    return res.status(201).json({
      success: true,
      message: "Conductor creado exitosamente",
      data: newConductor,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "No se pudo crear el conductor",
      error: error.message,
    });
  }
};

export const updateDataConductor = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nombre,
      apellido,
      tipoDocumento,
      numDoc,
      numTel,
      estado,
    } = req.body;

    const dataToUpdate = {};

    if (nombre) dataToUpdate.nombre = nombre;
    if (apellido) dataToUpdate.apellido = apellido;
    if (tipoDocumento) dataToUpdate.tipoDocumento = tipoDocumento;
    if (numDoc) dataToUpdate.numDoc = numDoc;
    if (numTel) dataToUpdate.numTel = numTel;
    if (estado) dataToUpdate.estado = estado;
    if (req.file) {
      dataToUpdate.licencia = `/uploads/conductores/${req.file.filename}`;
    }

    const conductorActualizado = await Conductor.findByIdAndUpdate(
      id,
      dataToUpdate,
      { new: true }
    );

    if (!conductorActualizado) {
      return res.status(404).json({
        success: false,
        message: "Conductor no encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Conductor actualizado correctamente",
      data: conductorActualizado,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar el conductor",
      error: error.message,
    });
  }
};


export const InactivarDataConductor = async (req, res) => {
  try {
    const { id } = req.params;
    const {estado} = req.body;

    const conductor = await Conductor.findByIdAndUpdate(
      id,
      { estado: estado },
      { new: true }
    );

    if (!conductor) {
      return res.status(404).json({
        success: false,
        message: "Conductor no encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Conductor inactivado correctamente",
      data: conductor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al inactivar el conductor",
      error: error.message,
    });
  }
};
