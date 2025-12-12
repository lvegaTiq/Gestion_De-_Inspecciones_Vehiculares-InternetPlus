import e from "express";
import { activarVehiculo, CambioEstadoVehiculo, getDataVehiculo, postDataVehiculo, updateVehiculo } from "../controllers/vehiculo/vehiculo.js";

const router = e.Router();

router.get('/vehiculo-get', getDataVehiculo);
router.post('/vehiculo-post', postDataVehiculo);
router.patch('/vehiculo-cambio-estado/:id', CambioEstadoVehiculo);
router.put('/vehiculo-update/:id', updateVehiculo);
router.patch('/vehiculo-inactivar/:id', activarVehiculo);

export default router;