import propietario from "../../Models/propietario.js";

export const getDataPropietario = async (req, res) => {
  try {
    const { page = 1, limit = 300 } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
    };

    const propietarios = await propietario.paginate({}, options);

    return res.status(200).json({
      success: true,
      data: propietarios,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al consultar los datos del propietario",
      error: error.message,
    });
  }
};

export const postDataPropietario = async (req, res) => {
  try {
    const { nombre, apellido, tipoDoc, numDoc, numTel, estado } = req.body;

    const existingPropietario = await propietario.findOne({ numDoc });
    if (existingPropietario) {
      return res.status(400).json({
        success: false,
        message: `El propietario con ${tipoDoc} ${numDoc} ya existe`,
      });
    }

    const nuevoPropietario = new propietario({
      nombre,
      apellido,
      tipoDoc,
      numDoc,
      numTel,
      estado: estado || "Activo", 
    });

    await nuevoPropietario.save();

    return res.status(201).json({
      success: true,
      message: "Propietario creado correctamente",
      data: nuevoPropietario,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "No se pudo crear el propietario",
      error: error.message,
    });
  }
};

export const updateDataPropietario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, tipoDoc, numDoc, numTel, estado } = req.body;

    if (numDoc) {
      const existente = await propietario.findOne({
        numDoc,
        _id: { $ne: id },
      });

      if (existente) {
        return res.status(400).json({
          success: false,
          message: `Ya existe un propietario con el documento ${numDoc}`,
        });
      }
    }

    const dataToUpdate = {};
    if (nombre) dataToUpdate.nombre = nombre;
    if (apellido) dataToUpdate.apellido = apellido;
    if (tipoDoc) dataToUpdate.tipoDoc = tipoDoc;
    if (numDoc) dataToUpdate.numDoc = numDoc;
    if (numTel) dataToUpdate.numTel = numTel;
    if (estado) dataToUpdate.estado = estado;

    const propietarioActualizado = await propietario.findByIdAndUpdate(
      id,
      dataToUpdate,
      { new: true }
    );

    if (!propietarioActualizado) {
      return res.status(404).json({
        success: false,
        message: "Propietario no encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Propietario actualizado correctamente",
      data: propietarioActualizado,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar el propietario",
      error: error.message,
    });
  }
};


export const CambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body

    const propietarioActualizado = await propietario.findByIdAndUpdate(
      id,
      { estado: estado },
      { new: true }
    );

    if (!propietarioActualizado) {
      return res.status(404).json({
        success: false,
        message: "Propietario no encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Propietario inactivado correctamente",
      data: propietarioActualizado,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al inactivar el propietario",
      error: error.message,
    });
  }
};

