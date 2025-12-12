import request from "supertest";
import { expect } from "chai";
import path from "path";
import fs from "fs";
import app from "../../app.js";
import { connectTestDB, clearTestDB, closeTestDB } from "./setup.db.js";

describe("INTEGRACIÓN - Reporte Estado (PDF)", () => {
  let propietarioId;
  let conductorId;
  let vehiculoId;

  const licenciaPath = path.resolve(process.cwd(), "test", "assets", "licencia.jpg");

  const propietarioPayload = {
    nombre: "Ana",
    apellido: "Lopez",
    tipoDoc: "Cedula de ciudadania",
    numDoc: 111,
    numTel: 300,
    estado: "Activo",
  };

  const baseEstadoPayload = {
    FechaEstado: "2025-12-12",
    kilometraje: 120000,
    Nivel: [{ limpiavidrios: true }],
    pedal: [{ frenos: true }],
    Luz: [{ luces: true }],
    botiquin: [{ extintor: true, fechaVencimiento: "2025-10-10" }],
    varios: [{ llantas: true }],
    Observacion: "Aceite de motor bajo", 
  };

  before(async () => {
    await connectTestDB();
  });

  after(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();

    expect(fs.existsSync(licenciaPath), `No existe: ${licenciaPath}`).to.equal(true);

    const prop = await request(app)
      .post("/api/propietario-post")
      .send(propietarioPayload);

    expect([200, 201]).to.include(prop.status);
    propietarioId = prop.body.data._id;

    const cond = await request(app)
      .post("/api/conductor-post")
      .field("nombre", "Maria")
      .field("apellido", "Lopez")
      .field("tipoDocumento", "Cedula de ciudadania")
      .field("numDoc", "987654321")
      .field("numTel", "3102223344")
      .attach("licencia", licenciaPath);

    expect([200, 201]).to.include(cond.status);
    conductorId = cond.body.data._id;

    const veh = await request(app).post("/api/vehiculo-post").send({
      tipoVehiculo: "Carro",
      placa: "ABC123",
      modelo: "2018",
      fechaSoat: "2025-02-01",
      fechaTecno: "2025-03-01",
      propietarioId,
      conductorId,
    });

    expect([200, 201]).to.include(veh.status);
    vehiculoId = veh.body.data._id;

    const est = await request(app)
      .post("/api/estado-post")
      .send({ ...baseEstadoPayload, vehiculoId });

    expect(est.status).to.equal(201);
    expect(est.body.success).to.equal(true);
  });

  it("GET /api/generar-reporte/:vehiculoId -> debe generar reporte", async () => {
    const res = await request(app).get(`/api/generar-reporte/${vehiculoId}`);

    expect(res.status).to.equal(200);

    const ct = res.headers["content-type"] || "";

    if (ct.includes("application/pdf")) {
      expect(res.body).to.exist;
    } else {
      expect(res.body).to.be.an("object");
      if (typeof res.body.success !== "undefined") {
        expect(res.body.success).to.equal(true);
      }
    }
  });
});
