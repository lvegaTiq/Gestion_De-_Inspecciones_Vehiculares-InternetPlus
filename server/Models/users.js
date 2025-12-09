import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const UserSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    tipoDocumento: {
        type: String,
        enum: ['Cedula de ciudadania', 'Cedula de extranjería', 'Pasaporte'],
        required: true
    },
    documento: {
        type: String,
        required: true
    },

    email: {
        type:String,
        unique:true,
        required: true
    },
    telefono: {
        type:Number,
        required: true
    },
    password: {
        type: String,
        required:true
    },
    role: {
        type: String,
        enum: ['Admin', 'Supervisor'],
        required: true
    }
})

UserSchema.plugin(mongoosePaginate)
export default mongoose.model("users", UserSchema)