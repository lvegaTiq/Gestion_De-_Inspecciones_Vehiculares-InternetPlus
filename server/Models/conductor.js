import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const conductorScheme = new mongoose.Schema({
    Nombre: {
        type: String
    },
    Apellido:{
        type:String
    },
    TipoDocumento: {
        type:String,
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
    },
    licencia: {
        data:Buffer,
        contentType: String
    }
})

conductorScheme.plugin(mongoosePaginate);
export default mongoose.model("conductor", conductorScheme);
