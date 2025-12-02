import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const vehiculoSchema = new mongoose.Schema({
    TipoVehiculo: {
        type: String
    },
    placa: {
        type: String
    },
    Modelo: {
        type: String
    },
    FechaSoat: {
        type: Date
    }
})