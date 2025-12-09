import mongoose, { mongo } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const propietarioSchema= new mongoose.Schema({
    nombre:{
        type: String,
        require: true
    },
    apellido: {
        type:String,
        require:true
    },
    tipoDoc: {
        type: String,
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
    }
})

propietarioSchema.plugin(mongoosePaginate);
export default mongoose.model("propietario", propietarioSchema);