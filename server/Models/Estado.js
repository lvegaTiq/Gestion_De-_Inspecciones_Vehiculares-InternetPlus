import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const EstadoVehiculoSchema = new mongoose.Schema({
    FechaEstado: {
        type: Date,
        require: true
    },
    kilometraje: {
        type: Number,
        require: true
    },
    Nivel:[
        {
            limpiavidrios: {
                type:Boolean
            },
            AceiteMotor: {
                type: Boolean
            },
            LiquidoFrenos: {
                type: Boolean
            },
            LiquidoRefrigerante: {
                type: Boolean
            },
            NivelLiquidoHidraulico: {
                type: Boolean
            }
        }
    ],
    pedal:[
        {
            frenos:{
                type: Boolean
            },
            Acelerador:{
                type: Boolean
            },
            clutsh: {
                type: Boolean
            }
        }
    ],
    Luz: [
        {
            Direccional: {
                type: Boolean
            },
            luces: {
                type: Boolean
            },
            lucesInternas:{
                type: Boolean
            },
            estacionarias: {
                type: Boolean
            },
            stops: {
                type: Boolean
            },
            testigos: {
                type: Boolean
            },
            LuzReversa:{
                type: Boolean
            }
        }
    ],
    botiquin: [
        {
            extintor: {
                type: Boolean
            },
            fechaVencimiento: {
                type: Date
            },
            llantaRepuesto: {
                type: Boolean
            },
            CrucetaAcordePernos: {
                type: Boolean
            },
            Señales: {
                type: Boolean
            },
            tacos: {
                type: Boolean
            },
            cajaHerramientas: {
                type: Boolean
            },
            linterna: {
                type: Boolean
            },
            gato: {
                type: Boolean
            },
            botiquinPrimerosAuxilios: {
                type: Boolean
            }
        }
    ],
    varios : [
        {
            bateria: {
                type: Boolean
            },
            llantas: {
                type: Boolean
            },
            rines: {
                type: Boolean
            }, 
            cinturonSeguridad: {
                type: Boolean
            },
            pitoReversa: {
                type: Boolean
            },
            pito: {
                type: Boolean
            },
            frenoEmergencia: {
                type: Boolean
            },
            Espejos: {
                type: Boolean
            },
            EstadoCarcasaLuces: {
                type: Boolean
            },
            limpiaparabrisas: {
                type: Boolean
            },
            tapizado: {
                type: Boolean
            },
            panoramico: {
                type: Boolean
            }
        }
    ],
    Observacion: {
        type: String
    }
})

EstadoVehiculoSchema.plugin(mongoosePaginate);
export default mongoose.model('estado_vehidulo', EstadoVehiculoSchema);