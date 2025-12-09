import e from "express";
import { getDataEstadoVehiculo, postDataEstadoVehiculo } from "../controllers/Estado_vehiculo/estado_vehiculo.js";

const router = e.Router();

router.get('/estado-get', getDataEstadoVehiculo);
router.post('/estado-post', postDataEstadoVehiculo);

export default router