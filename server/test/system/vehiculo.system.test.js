import request from "supertest";
import { expect } from "chai";
import path from "path";
import fs from "fs";
import app from "../../app.js";
import { connectTestDB, clearTestDB, closeTestDB } from "../integration/setup.db.js";

describe("SISTEMA - Vehículo (flujo completo)", () => {
  let propietarioId;
  let conductorId;
  let vehiculoId;

  const licenciaPath = path.resolve(process.cwd(), "test", "assets", "licencia.jpg");

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
  });

  it("Crear -> Listar -> Actualizar -> Inactivar -> Cambio estado", async () => {
    const created = await request(app).post("/api/vehiculo-post").send({
      tipoVehiculo: "Carro",
      placa: "ABC123",
      modelo: "2018",
      fechaSoat: "2025-02-01",
      fechaTecno: "2025-03-01",
      propietarioId,
      conductorId,
    });

    expect([200, 201]).to.include(created.status);
    expect(created.body.success).to.equal(true);
    vehiculoId = created.body.data._id;

    const list = await request(app).get("/api/vehiculo-get");
    expect(list.status).to.equal(200);
    expect(list.body.success).to.equal(true);
    expect(list.body.data).to.exist;

    const updated = await request(app)
      .put(`/api/vehiculo-update/${vehiculoId}`)
      .send({ modelo: "2006" });

    expect(updated.status).to.equal(200);
    expect(updated.body.success).to.equal(true);
    expect(String(updated.body.data.modelo)).to.equal("2006");

    const inact = await request(app)
      .patch(`/api/vehiculo-inactivar/${vehiculoId}`)
      .send({ estado: "Inactivo" });

    expect(inact.status).to.equal(200);
    expect(inact.body.success).to.equal(true);

    const cambioOk = await request(app)
      .patch(`/api/vehiculo-cambio-estado/${vehiculoId}`)
      .send({ estado: "Pendiente" });

    expect(cambioOk.status).to.equal(200);
    expect(cambioOk.body.success).to.equal(true);
    expect(cambioOk.body.data.estado).to.equal("Pendiente");

    const cambioBad = await request(app)
      .patch(`/api/vehiculo-cambio-estado/${vehiculoId}`)
      .send({ estado: "Inactivo" });

    expect(cambioBad.status).to.equal(400);
    expect(cambioBad.body.success).to.equal(false);
  });
});
