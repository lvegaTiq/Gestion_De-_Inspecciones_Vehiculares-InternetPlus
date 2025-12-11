import Estado from '../Models/Estado.js';
import vehiculo from '../Models/vehiculo.js';
import PDFDocument from 'pdfkit';

export const getReportesEstado = async (req, res) => {
  try {
    const { vehiculoId } = req.params;

    if (!vehiculoId) {
      return res.status(400).json({
        success: false,
        message: "Debe enviar el id del vehículo en la ruta.",
      });
    }

    const vehiculoDoc = await vehiculo.findById(vehiculoId)
      .populate("propietario")
      .populate("conductor")
      .lean();

    if (!vehiculoDoc) {
      return res.status(404).json({
        success: false,
        message: "Vehículo no encontrado",
      });
    }

    const estados = await Estado.find({ Vehiculo: vehiculoId })
      .sort({ FechaEstado: 1 })
      .lean();

    const totalInspecciones = estados.length;
    const fechaPrimeraInspeccion = estados[0]?.FechaEstado || null;
    const fechaUltimaInspeccion =
      estados[estados.length - 1]?.FechaEstado || null;
    const ultimoEstado = estados[estados.length - 1] || null;

    const estadoActual = vehiculoDoc.estado || "Sin información";
    const esMalEstado = estadoActual === "Mal estado";

    const tipoVehiculo =
      (vehiculoDoc.tipoVehiculo || vehiculoDoc.tipo || "").toLowerCase();

    const totalMalEstado = estados.filter(
      (e) => e.Observacion && e.Observacion.trim() !== ""
    ).length;
    const totalBuenEstado = totalInspecciones - totalMalEstado;

    const CAMPOS_CHECKLIST_CARRO = {
      Nivel: [
        { key: "limpiavidrios", label: "Limpiavidrios" },
        { key: "AceiteMotor", label: "Aceite motor" },
        { key: "LiquidoFrenos", label: "Líquido de frenos" },
        { key: "LiquidoRefrigerante", label: "Líquido refrigerante" },
        { key: "NivelLiquidoHidraulico", label: "Nivel líquido hidráulico" },
      ],
      pedal: [
        { key: "frenos", label: "Pedal frenos" },
        { key: "Acelerador", label: "Acelerador" },
        { key: "clutsh", label: "Clutch" },
      ],
      Luz: [
        { key: "Direccional", label: "Direccionales" },
        { key: "luces", label: "Luces principales" },
        { key: "lucesInternas", label: "Luces internas" },
        { key: "estacionarias", label: "Estacionarias" },
        { key: "stops", label: "Stops" },
        { key: "testigos", label: "Testigos tablero" },
        { key: "LuzReversa", label: "Luz reversa" },
      ],
      botiquin: [
        { key: "extintor", label: "Extintor" },
        { key: "llantaRepuesto", label: "Llanta de repuesto" },
        { key: "CrucetaAcordePernos", label: "Cruceta acorde a pernos" },
        { key: "Señales", label: "Señales" },
        { key: "tacos", label: "Tacos" },
        { key: "cajaHerramientas", label: "Caja de herramientas" },
        { key: "linterna", label: "Linterna" },
        { key: "gato", label: "Gato" },
        { key: "botiquinPrimerosAuxilios", label: "Botiquín primeros auxilios" },
      ],
      varios: [
        { key: "llantas", label: "Llantas" },
        { key: "bateria", label: "Batería" },
        { key: "rines", label: "Rines" },
        { key: "cinturonSeguridad", label: "Cinturones de seguridad" },
        { key: "pitoReversa", label: "Pito reversa" },
        { key: "pito", label: "Pito" },
        { key: "frenoEmergencia", label: "Freno de emergencia" },
        { key: "Espejos", label: "Espejo interior" },
        { key: "espejosLaterales", label: "Espejos laterales" },
        { key: "EstadoCarcasaLuces", label: "Carcasa luces" },
        { key: "limpiaparabrisas", label: "Limpiaparabrisas" },
        { key: "tapizado", label: "Tapizado" },
        { key: "panoramico", label: "Panorámico" },
      ],
    };

    const CAMPOS_CHECKLIST_MOTO = {
      Nivel: [
        { key: "AceiteMotor", label: "Aceite motor" },
        { key: "LiquidoFrenos", label: "Líquido de frenos" },
        { key: "LiquidoRefrigerante", label: "Líquido refrigerante" },
      ],
      pedal: [
        { key: "frenos", label: "Frenos" },
        { key: "Acelerador", label: "Acelerador" },
        { key: "clutsh", label: "Clutch" },
        { key: "barras", label: "Barras" },
        { key: "amortiguadores", label: "Amortiguadores" },
        { key: "Casco_visera", label: "Casco/visera" },
        { key: "sillin", label: "Sillín" },
        { key: "Posapies", label: "Posapiés" },
      ],
      Luz: [
        { key: "Direccional", label: "Direccionales" },
        { key: "luces", label: "Luces principales" },
        { key: "estacionarias", label: "Estacionarias" },
        { key: "stops", label: "Stops" },
        { key: "testigos", label: "Testigos tablero" },
      ],
      varios: [
        { key: "bateria", label: "Batería" },
        { key: "llantas", label: "Llantas" },
        { key: "rines", label: "Rines" },
        { key: "pito", label: "Pito" },
        { key: "espejosLaterales", label: "Espejos laterales" },
        { key: "EstadoCarcasaLuces", label: "Carcasa luces" },
      ],
    };

    const CHECKLIST_CONFIG =
      tipoVehiculo === "moto"
        ? CAMPOS_CHECKLIST_MOTO
        : CAMPOS_CHECKLIST_CARRO;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=reporte-${vehiculoDoc.placa || vehiculoDoc._id}.pdf`
    );

    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(res);

    const ancho = doc.page.width;
    const margen = 40;

    doc
      .rect(0, 0, ancho, 70)
      .fill("#1f4e79");

    doc
      .fillColor("white")
      .fontSize(22)
      .text("Reporte de Estado del Vehículo", margen, 25, {
        align: "left",
      });

    doc.moveDown();
    doc.fillColor("black");

    let y = 90;
    doc
      .fontSize(14)
      .text("Datos del vehículo", margen, y);
    y += 20;

    doc
      .fontSize(11)
      .text(`Placa: ${vehiculoDoc.placa || "-"}`, margen, y);
    y += 15;
    doc.text(
      `Tipo: ${vehiculoDoc.tipoVehiculo || vehiculoDoc.tipo || "-"}`,
      margen,
      y
    );
    y += 15;
    doc.text(`Modelo: ${vehiculoDoc.modelo || "-"}`, margen, y);
    y += 15;

    const propietario = vehiculoDoc.propietario
      ? `${vehiculoDoc.propietario.nombre} ${vehiculoDoc.propietario.apellido}`
      : "Sin propietario";
    const conductor = vehiculoDoc.conductor
      ? `${vehiculoDoc.conductor.nombre} ${vehiculoDoc.conductor.apellido}`
      : "Sin conductor";

    doc.text(`Propietario: ${propietario}`, margen, y);
    y += 15;
    doc.text(`Conductor: ${conductor}`, margen, y);
    y += 30;

    doc
      .fontSize(14)
      .text("Resumen de inspecciones", margen, y);
    y += 20;
    doc.fontSize(11).text(`Total inspecciones: ${totalInspecciones}`, margen, y);
    y += 15;
    if (fechaPrimeraInspeccion) {
      doc.text(
        `Primera inspección: ${new Date(
          fechaPrimeraInspeccion
        ).toLocaleDateString("es-CO")}`,
        margen,
        y
      );
      y += 15;
    }
    if (fechaUltimaInspeccion) {
      doc.text(
        `Última inspección: ${new Date(
          fechaUltimaInspeccion
        ).toLocaleDateString("es-CO")}`,
        margen,
        y
      );
      y += 15;
    }
    y += 10;
    doc.text(`En buen estado: ${totalBuenEstado}`, margen, y);
    y += 15;
    doc.text(`En mal estado: ${totalMalEstado}`, margen, y);

    const cardX = ancho / 2 + 10;
    const cardY = 90;
    const cardWidth = ancho / 2 - margen - 10;
    const cardHeight = 150;

    doc
      .roundedRect(cardX, cardY, cardWidth, cardHeight, 10)
      .fill("#f3f6fb");

      doc
        .fillColor("#1f4e79")
        .fontSize(14)
        .text("Estado actual", cardX + 20, cardY + 20);

      const estadoBoxY = cardY + 50;
      const estadoColor = esMalEstado ? "#e74c3c" : "#27ae60";

      doc
        .roundedRect(cardX + 15, estadoBoxY, cardWidth - 30, 40, 8)
        .fill(estadoColor);

      doc
        .fillColor("white")
        .fontSize(16)
        .text(estadoActual, cardX + 20, estadoBoxY + 12);

      doc.fillColor("black").fontSize(10);

      const descripcion = esMalEstado
        ? "El vehículo requiere atención mecánica."
        : "El vehículo se encuentra en buen estado.";

      doc.text(descripcion, cardX + 15, estadoBoxY + 60, {
        width: cardWidth - 30,
      });

      if (ultimoEstado) {
  doc.addPage();

  doc
    .fontSize(18)
    .fillColor("#1f4e79")
    .text("Detalle del último checklist", margen, 40);

  doc.fillColor("black");

  doc
    .fontSize(12)
    .text(
      `Fecha: ${new Date(ultimoEstado.FechaEstado).toLocaleDateString("es-CO")} | Kilometraje: ${ultimoEstado.kilometraje} km`,
      margen,
      80
    );

  if (ultimoEstado.Observacion) {
    doc
      .fontSize(11)
      .text(`Observación: ${ultimoEstado.Observacion}`, margen, 100, {
        width: ancho - margen * 2,
      });
  }

  let yChecklist = 140;
  Object.entries(CHECKLIST_CONFIG).forEach(([grupo, campos]) => {
    const datosGrupo = ultimoEstado[grupo]?.[0] || {};

    if (yChecklist > doc.page.height - 120) {
      doc.addPage();
      yChecklist = 60;
    }

    doc
      .fontSize(14)
      .fillColor("#1f4e79")
      .text(grupo, margen, yChecklist);
    yChecklist += 20;

    doc.fillColor("black");

    campos.forEach((campo) => {
      const ok = !!datosGrupo[campo.key];

      if (yChecklist > doc.page.height - 60) {
        doc.addPage();
        yChecklist = 60;
      }

      doc
        .fontSize(11)
        .fillColor(ok ? "#27ae60" : "#e74c3c")
        .text(
          `${ok ? "✔" : "✘"} ${campo.label}`,
          margen + 20,
          yChecklist
        );

      yChecklist += 15;
    });

    yChecklist += 10;
    doc.fillColor("black");
  });
}

    if (estados.length > 0) {
      doc.addPage();

      doc
        .fontSize(16)
        .fillColor("#1f4e79")
        .text("Historial de inspecciones", margen, 50);
      doc.fillColor("black");

      let tableTop = 80;
      const rowHeight = 20;
      const colFecha = margen;
      const colKm = colFecha + 110;
      const colEstado = colKm + 80;
      const colObs = colEstado + 120;
      const maxY = doc.page.height - margen;

      doc.fontSize(11).text("Fecha", colFecha, tableTop);
      doc.text("Kilometraje", colKm, tableTop);
      doc.text("Estado", colEstado, tableTop);
      doc.text("Observación", colObs, tableTop);
      tableTop += rowHeight;

      doc
        .moveTo(margen, tableTop - 5)
        .lineTo(ancho - margen, tableTop - 5)
        .strokeColor("#cccccc")
        .stroke()
        .strokeColor("#000000");

      estados.forEach((e, index) => {
        if (tableTop > maxY) {
          doc.addPage();
          tableTop = 80;
          doc.fontSize(11).text("Fecha", colFecha, tableTop);
          doc.text("Kilometraje", colKm, tableTop);
          doc.text("Estado", colEstado, tableTop);
          doc.text("Observación", colObs, tableTop);
          tableTop += rowHeight;
          doc
            .moveTo(margen, tableTop - 5)
            .lineTo(ancho - margen, tableTop - 5)
            .strokeColor("#cccccc")
            .stroke()
            .strokeColor("#000000");
        }

        const fechaTxt = e.FechaEstado
          ? new Date(e.FechaEstado).toLocaleDateString("es-CO")
          : "-";

        const estadoTxt =
          e.Observacion && e.Observacion.trim() !== ""
            ? "Mal estado"
            : "Buen estado";

        doc.fontSize(10).text(fechaTxt, colFecha, tableTop);
        doc.text(String(e.kilometraje || "-"), colKm, tableTop);
        doc.text(estadoTxt, colEstado, tableTop, {
          width: 110,
        });

        doc.text(e.Observacion || "-", colObs, tableTop, {
          width: ancho - margen - colObs,
        });

        tableTop += rowHeight;
      });
    }

    doc.end();
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "No se pudo generar el PDF del reporte",
        error: error.message,
      });
    }
  }
};
