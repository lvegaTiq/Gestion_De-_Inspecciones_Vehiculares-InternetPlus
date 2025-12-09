import e from "express";
import { getDataConductor, postDataConductor } from "../controllers/conductor/conductor.js";
import { uploadLicencia } from "../middlewares/uploadLicencia.js";

const router = e.Router();

router.get('/conductor-get', getDataConductor);
router.post('/conductor-post', uploadLicencia.single("licencia"), postDataConductor);

export default router