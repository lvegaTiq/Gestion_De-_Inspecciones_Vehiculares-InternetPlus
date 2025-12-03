import mongoose, { mongo } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const propietarioSchema= new mongoose.Schema({
    Nombre:{
        type: String,
        require: true
    },
    Apellido: {
        type:String,
        require:true
    },
    TipoDoc: {
        type: String,
        enum: ['Cedula de ciudadania', 'Cedula de extranjería', 'Pasaporte'],
        require: true
    },
    NumDoc: {
        type: Number,
        require: true
    },
    NumTel: {
        type: Number,
        require: true
    }
})

propietarioSchema.plugin(mongoosePaginate);
export default mongoose.model("propietario", propietarioSchema);