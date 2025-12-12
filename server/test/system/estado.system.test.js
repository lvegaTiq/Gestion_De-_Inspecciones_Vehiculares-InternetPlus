import request from "supertest";
import { expect } from "chai";
import path from "path";
import fs from "fs";
import app from "../../app.js";
import { connectTestDB, clearTestDB, closeTestDB } from "../integration/setup.db.js";

describe("SISTEMA - Estado (flujo completo)", () => {
  let propietarioId;
  let conductorId;
  let vehiculoId;
  let estadoId;

  const licenciaPath = path.resolve(process.cwd(), "test", "assets", "licencia.jpg");

  const baseEstadoPayload = {
    FechaEstado: "2025-12-12",
    kilometraje: 120000,
    Nivel: [{ limpiavidrios: true, AceiteMotor: true }],
    pedal: [{ frenos: true, Acelerador: true, clutsh: true }],
    Luz: [{ luces: true, stops: true }],
    botiquin: [{ extintor: true, fechaVencimiento: "2025-10-10" }],
    varios: [{ llantas: true, bateria: true }],
  };

  before(async () => {
    await connectTestDB();
  });

  after(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();

    propietarioId = undefined;
    conductorId = undefined;
    vehiculoId = undefined;
    estadoId = undefined;

    expect(fs.existsSync(licenciaPath), `No existe: ${licenciaPath}`).to.equal(true);

    const prop = await request(app).post("/api/propietario-post").send({
      nombre: "Ana",
      apellido: "Lopez",
      tipoDoc: "Cedula de ciudadania",
      numDoc: 111,
      numTel: 300,
      estado: "Activo",
    });
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
  });

  it("Crear Estado -> Listar Estados -> Generar Reporte", async () => {
    const createdEstado = await request(app).post("/api/estado-post").send({
      ...baseEstadoPayload,
      Observacion: "Aceite de motor bajo",
      vehiculoId,
    });

    expect(createdEstado.status).to.equal(201);
    expect(createdEstado.body.success).to.equal(true);
    expect(createdEstado.body.estadoVehiculo).to.equal("Mal estado");
    expect(createdEstado.body.data).to.have.property("_id");
    estadoId = createdEstado.body.data._id;

    const list = await request(app).get("/api/estado-get?page=1&limit=10");
    expect(list.status).to.equal(200);
    expect(list.body.success).to.equal(true);
    expect(list.body.data).to.exist; 
    const rep = await request(app).get(`/api/generar-reporte/${vehiculoId}`);
    expect(rep.status).to.equal(200);
    expect((rep.headers["content-type"] || "")).to.include("application/pdf");
  });
});
