import e from "express";
import { CambiarEstado, getDataPropietario, postDataPropietario, updateDataPropietario } from "../controllers/propietario/propietario.js";

const router = e.Router();
router.get('/propietario-get', getDataPropietario); 
router.post('/propietario-post', postDataPropietario);
router.put('/propietario-put/:id', updateDataPropietario);
router.patch('/propietario-patch/:id', CambiarEstado)
export default router