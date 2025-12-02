import mongoose, { mongo, Schema, Types } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const UserSchema = new mongoose.Schema({
    Nombre: {
        type: String
    },
    Apellido: {
        type: String
    },
    TipoDocumento: {
        type: String,
        enum: ['Cedula de ciudadania', 'Cedula de extranjería', 'Pasaporte'],
        require: true
    },
    Documento: {
        type: String,
        unique: true,
        require: true
    },

    Email: {
        type:String,
        unique:true,
        require: true
    },
    Telefono: {
        type:Number
    },
    password: {
        type: String,
        require:true
    },
    Role: {
        type: String,
        enum: ['Admin', 'Supervisor'],
        require: true
    }
})

UserSchema.plugin(mongoosePaginate)
export default mongoose.model("users", UserSchema)