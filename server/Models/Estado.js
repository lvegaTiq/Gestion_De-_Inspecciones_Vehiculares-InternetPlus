import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const EstadoVehiculoSchema = new mongoose.Schema({
    FechaEstado: {
        type: Date,
        required: true
    },
    kilometraje: {
        type: Number,
        required: true
    },
    Nivel:[
        {
            limpiavidrios: {
                type:Boolean,
                default: false
            },
            AceiteMotor: {
                type: Boolean,
                default: false
            },
            LiquidoFrenos: {
                type: Boolean,
                default: false
            },
            LiquidoRefrigerante: {
                type: Boolean,
                default: false
            },
            NivelLiquidoHidraulico: {
                type: Boolean,
                default: false
            }
        }
    ],
    pedal:[
        {
            frenos:{
                type: Boolean,
                default: false
            },
            Acelerador:{
                type: Boolean,
                default: false
            },
            clutsh: {
                type: Boolean,
                default: false
            },
            barras: {
                type:Boolean,
                default: false
            },
            amortiguadores: {
                type:Boolean,
                default: false
            },
            Casco_visera: {
                type:Boolean,
                default: false
            },
            sillin: {
                type:Boolean,
                default: false
            },
            Posapies: {
                type:Boolean,
                default: false
            },
        }
    ],
    Luz: [
        {
            Direccional: {
                type: Boolean,
                default: false
            },
            luces: {
                type: Boolean,
                default: false
            },
            lucesInternas:{
                type: Boolean,
                default: false
            },
            estacionarias: {
                type: Boolean,
                default: false
            },
            stops: {
                type: Boolean,
                default: false
            },
            testigos: {
                type: Boolean,
                default: false
            },
            LuzReversa:{
                type: Boolean,
                default: false
            }
        }
    ],
    botiquin: [
        {
            extintor: {
                type: Boolean,
                default: false
            },
            fechaVencimiento: {
                type: Date
            },
            llantaRepuesto: {
                type: Boolean,
                default: false
            },
            CrucetaAcordePernos: {
                type: Boolean,
                default: false
            },
            Señales: {
                type: Boolean,
                default: false
            },
            tacos: {
                type: Boolean,
                default: false
            },
            cajaHerramientas: {
                type: Boolean,
                default: false
            },
            linterna: {
                type: Boolean,
                default: false
            },
            gato: {
                type: Boolean,
                default: false
            },
            botiquinPrimerosAuxilios: {
                type: Boolean,
                default: false
            }
        }
    ],
    varios : [
        {
            bateria: {
                type: Boolean,
                default: false
            },
            llantas: {
                type: Boolean,
                default: false
            },
            rines: {
                type: Boolean,
                default: false
            }, 
            cinturonSeguridad: {
                type: Boolean,
                default: false
            },
            pitoReversa: {
                type: Boolean,
                default: false
            },
            pito: {
                type: Boolean,
                default: false
            },
            frenoEmergencia: {
                type: Boolean,
                default: false
            },
            Espejos: {
                type: Boolean,
                default: false
            },
            espejosLaterales: {
                type:Boolean,
                default: false
            },
            EstadoCarcasaLuces: {
                type: Boolean,
                default: false
            },
            limpiaparabrisas: {
                type: Boolean,
                default: false
            },
            tapizado: {
                type: Boolean,
                default: false
            },
            panoramico: {
                type: Boolean,
                default: false
            }
        }
    ],
    Observacion: {
        type: String,
        default:""
    },
    Vehiculo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vehiculo",
        required: true,
    }
})

EstadoVehiculoSchema.plugin(mongoosePaginate);
export default mongoose.model('estado_vehidulo', EstadoVehiculoSchema);