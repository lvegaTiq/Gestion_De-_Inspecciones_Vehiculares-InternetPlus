import request from "supertest";
import { expect } from "chai";
import path from "path";
import fs from "fs";
import app from "../../app.js";
import { connectTestDB, clearTestDB, closeTestDB } from "./setup.db.js";

describe("INTEGRACIÓN - Vehículo", () => {
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
    const propRes = await request(app)
      .post("/api/propietario-post")
      .send(propietarioPayload);

    expect([200, 201]).to.include(propRes.status);
    propietarioId = propRes.body.data._id;

    const condRes = await request(app)
      .post("/api/conductor-post")
      .field("nombre", "Maria")
      .field("apellido", "Lopez")
      .field("tipoDocumento", "Cedula de ciudadania")
      .field("numDoc", "987654321")
      .field("numTel", "3102223344")
      .attach("licencia", licenciaPath);

    expect([200, 201]).to.include(condRes.status);
    conductorId = condRes.body.data._id;
  });

  it("POST /api/vehiculo-post -> debe crear vehículo", async () => {
    const res = await request(app)
      .post("/api/vehiculo-post")
      .send({
        tipoVehiculo: "Carro",
        placa: "ABC123",
        modelo: "2018",
        fechaSoat: "2025-02-01",
        fechaTecno: "2025-03-01",
        propietarioId,
        conductorId,
      });

    if (![200, 201].includes(res.status)) console.log("VEH CREATE:", res.status, res.body);

    expect([200, 201]).to.include(res.status);
    expect(res.body.success).to.equal(true);
    expect(res.body.data).to.have.property("_id");

    vehiculoId = res.body.data._id;
  });

  it("GET /api/vehiculo-get -> debe listar vehículos", async () => {
    const created = await request(app)
      .post("/api/vehiculo-post")
      .send({
        tipoVehiculo: "Carro",
        placa: "ABC123",
        modelo: "2018",
        fechaSoat: "2025-02-01",
        fechaTecno: "2025-03-01",
        propietarioId,
        conductorId,
      });

    expect([200, 201]).to.include(created.status);
    vehiculoId = created.body.data._id;

    const res = await request(app).get("/api/vehiculo-get");
    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal(true);
    expect(res.body.data).to.exist;
  });

  it("PUT /api/vehiculo-update/:id -> debe actualizar vehículo", async () => {
    const created = await request(app)
      .post("/api/vehiculo-post")
      .send({
        tipoVehiculo: "Carro",
        placa: "ABC123",
        modelo: "2018",
        fechaSoat: "2025-02-01",
        fechaTecno: "2025-03-01",
        propietarioId,
        conductorId,
      });

    expect([200, 201]).to.include(created.status);
    vehiculoId = created.body.data._id;

    const res = await request(app)
      .put(`/api/vehiculo-update/${vehiculoId}`)
      .send({ modelo: "2006" });

    if (res.status !== 200) console.log("VEH UPDATE:", res.status, res.body);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal(true);
    expect(String(res.body.data.modelo)).to.equal("2006");
  });

  it("PATCH /api/vehiculo-inactivar/:id -> debe inactivar vehículo", async () => {
    const created = await request(app)
      .post("/api/vehiculo-post")
      .send({
        tipoVehiculo: "Carro",
        placa: "ABC123",
        modelo: "2018",
        fechaSoat: "2025-02-01",
        fechaTecno: "2025-03-01",
        propietarioId,
        conductorId,
      });

    expect([200, 201]).to.include(created.status);
    vehiculoId = created.body.data._id;

    const res = await request(app)
      .patch(`/api/vehiculo-inactivar/${vehiculoId}`)
      .send({ estado: "Inactivo" });

    if (res.status !== 200) console.log("VEH INACTIVAR:", res.status, res.body);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal(true);
  });
   it("PATCH /api/vehiculo-cambio-estado/:id -> debe rechazar estado inválido", async () => {
    const res = await request(app)
      .patch(`/api/vehiculo-cambio-estado/${vehiculoId}`)
      .send({ estado: "Inactivo" });

    expect(res.status).to.equal(400);
    expect(res.body.success).to.equal(false);
  });
});
