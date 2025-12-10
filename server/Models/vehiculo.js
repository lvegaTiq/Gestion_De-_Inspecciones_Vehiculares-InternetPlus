import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const vehiculoSchema = new mongoose.Schema(
  {
    tipoVehiculo: {
      type: String,
      enum: [ 'Carro', 'Moto']
    },
    placa: {
      type: String,
      required: true,
      unique: true,
    },
    modelo: {
      type: String,
    },
    fechaSoat: {
      type: Date,
      required: true,
    },
    fechaTecno: {
      type: Date,
      required: true,
    },
    propietario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "propietario",
      required: true,
    },
    conductor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "conductor",
      required: true,
    },
    estadoVehiculo: {
      type: String,
      enum: ['Activo', 'Inactivo'],
      required: true
    },
    estado: {
        type: String,
        enum: ['Buen estado', 'Mal estado', 'Pendiente'],   
        required: true,
        default: 'Pendiente'
    }
  },
  {
    timestamps: true,
  }
);

vehiculoSchema.plugin(mongoosePaginate);
export default mongoose.model("vehiculo", vehiculoSchema);
