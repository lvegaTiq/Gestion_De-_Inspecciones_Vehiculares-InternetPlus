import e from "express";
import { getDataConductor, InactivarDataConductor, postDataConductor, updateDataConductor } from "../controllers/conductor/conductor.js";
import { uploadLicencia } from "../middlewares/uploadLicencia.js";

const router = e.Router();

router.get('/conductor-get', getDataConductor);
router.post('/conductor-post', uploadLicencia.single("licencia"), postDataConductor);
router.put('/conductor-put/:id', uploadLicencia.single('licencia'), updateDataConductor);
router.patch('/conductor-inactivar/:id', InactivarDataConductor)

export default router