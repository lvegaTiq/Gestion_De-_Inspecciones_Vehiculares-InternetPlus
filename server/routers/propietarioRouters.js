import e from "express";
import { getDataPropietario, postDataPropietario } from "../controllers/propietario/propietario.js";

const router = e.Router();
router.get('/propietario-get', getDataPropietario); 
router.post('/propietario-post', postDataPropietario);

export default router