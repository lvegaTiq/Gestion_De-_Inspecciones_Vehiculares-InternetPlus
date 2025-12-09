import e from "express";
import { CambioEstadoVehiculo, getDataVehiculo, postDataVehiculo } from "../controllers/vehiculo/vehiculo.js";

const router = e.Router();

router.get('/vehiculo-get', getDataVehiculo);
router.post('/vehiculo-post', postDataVehiculo);
router.patch('/vehiculo-cambio-estado', CambioEstadoVehiculo)

export default router;