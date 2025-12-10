import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const conductorScheme = new mongoose.Schema({
    nombre: {
        type: String
    },
    apellido:{
        type:String
    },
    tipoDocumento: {
        type:String,
        enum: ['Cedula de ciudadania', 'Cedula de extranjería', 'Pasaporte'],
        require: true 
    },
    numDoc: {
        type: Number,
        require: true
    },
    numTel: {
        type: Number,
        require: true
    },
    licencia: {
        type: String,
        default: null
    },
    estado: {
        type: String,
        enum: ['Activo', 'Inactivo'],
        required: true
    }
})

conductorScheme.plugin(mongoosePaginate);
export default mongoose.model("conductor", conductorScheme);
