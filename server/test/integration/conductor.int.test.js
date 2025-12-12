import request from "supertest";
import { expect } from "chai";
import path from "path";
import fs from "fs";
import app from "../../app.js";
import { connectTestDB, clearTestDB, closeTestDB } from "./setup.db.js";

describe("INTEGRACIÓN - Conductor", () => {
  let conductorId;

  const licenciaPath = path.resolve(process.cwd(), "test", "assets", "licencia.jpg");

  before(async () => {
    await connectTestDB();
  });

  after(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
    conductorId = undefined;

    expect(fs.existsSync(licenciaPath), `No existe: ${licenciaPath}`).to.equal(true);
  });

  it("POST /api/conductor-post -> debe crear conductor", async () => {
    const res = await request(app)
      .post("/api/conductor-post")
      .field("nombre", "Maria")
      .field("apellido", "Lopez")
      .field("tipoDocumento", "Cedula de ciudadania")
      .field("numDoc", "987654321")
      .field("numTel", "3102223344")
      .attach("licencia", licenciaPath);

    if (![200, 201].includes(res.status)) console.log("CONDUCTOR CREATE:", res.status, res.body);

    expect([200, 201]).to.include(res.status);
    expect(res.body.success).to.equal(true);
    expect(res.body.data).to.have.property("_id");

    conductorId = res.body.data._id;
  });

  it("GET /api/conductor-get -> debe listar conductores", async () => {
    const created = await request(app)
      .post("/api/conductor-post")
      .field("nombre", "Maria")
      .field("apellido", "Lopez")
      .field("tipoDocumento", "Cedula de ciudadania")
      .field("numDoc", "987654321")
      .field("numTel", "3102223344")
      .attach("licencia", licenciaPath);

    expect([200, 201]).to.include(created.status);
    conductorId = created.body.data._id;

    const res = await request(app).get("/api/conductor-get");

    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal(true);
    expect(res.body.data).to.exist;
  });

  it("PUT /api/conductor-put/:id -> debe actualizar conductor", async () => {
    const created = await request(app)
      .post("/api/conductor-post")
      .field("nombre", "Maria")
      .field("apellido", "Lopez")
      .field("tipoDocumento", "Cedula de ciudadania")
      .field("numDoc", "987654321")
      .field("numTel", "3102223344")
      .attach("licencia", licenciaPath);

    expect([200, 201]).to.include(created.status);
    conductorId = created.body.data._id;

    const res = await request(app)
      .put(`/api/conductor-put/${conductorId}`)
      .field("nombre", "Maria")
      .field("apellido", "Lopez")
      .field("tipoDocumento", "Cedula de ciudadania")
      .field("numDoc", "5248769845")
      .field("numTel", "3102223344")
      .attach("licencia", licenciaPath);

    if (res.status !== 200) console.log("CONDUCTOR UPDATE:", res.status, res.body);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal(true);
    expect(res.body.data.numDoc).to.equal(5248769845);

  });

  it("PATCH /api/conductor-inactivar/:id -> debe cambiar estado", async () => {
    const created = await request(app)
      .post("/api/conductor-post")
      .field("nombre", "Maria")
      .field("apellido", "Lopez")
      .field("tipoDocumento", "Cedula de ciudadania")
      .field("numDoc", "987654321")
      .field("numTel", "3102223344")
      .attach("licencia", licenciaPath);

    expect([200, 201]).to.include(created.status);
    conductorId = created.body.data._id;

    const res = await request(app)
      .patch(`/api/conductor-inactivar/${conductorId}`)
      .type("form")
      .send({ estado: "Inactivo" });

    if (res.status !== 200) console.log("CONDUCTOR INACTIVAR:", res.status, res.body);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal(true);
  });
});
