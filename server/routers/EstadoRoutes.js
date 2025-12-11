import e from "express";
import { getDataEstadoVehiculo, postDataEstadoVehiculo } from "../controllers/Estado_vehiculo/estado_vehiculo.js";
import { getReportesEstado } from "../controllers/generarReporteEstado.js";
const router = e.Router();

router.get('/estado-get', getDataEstadoVehiculo);
router.post('/estado-post', postDataEstadoVehiculo);
router.get('/generar-reporte/:vehiculoId', getReportesEstado)

router.get("/estado-test-pdf", (req, res) => {
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "inline; filename=test-reporte.pdf"
  );

  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(res);

  doc
    .fontSize(20)
    .text("Prueba de PDF", { align: "center" })
    .moveDown()
    .fontSize(12)
    .text("Si ves este texto, la generación de PDF funciona :)");

  doc.end();
});

export default router