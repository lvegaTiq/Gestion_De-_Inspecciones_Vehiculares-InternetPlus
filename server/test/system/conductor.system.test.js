import request from "supertest";
import { expect } from "chai";
import path from "path";
import fs from "fs";
import app from "../../app.js";
import { connectTestDB, clearTestDB, closeTestDB } from "../integration/setup.db.js";

describe("SISTEMA - Conductor (flujo completo)", () => {
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

  it("Crear -> Listar -> Actualizar -> Inactivar", async () => {

    const created = await request(app)
      .post("/api/conductor-post")
      .field("nombre", "Maria")
      .field("apellido", "Lopez")
      .field("tipoDocumento", "Cedula de ciudadania")
      .field("numDoc", "987654321")
      .field("numTel", "3102223344")
      .attach("licencia", licenciaPath);

    expect([200, 201]).to.include(created.status);
    expect(created.body.success).to.equal(true);
    expect(created.body.data).to.have.property("_id");
    conductorId = created.body.data._id;

    const list = await request(app).get("/api/conductor-get");
    expect(list.status).to.equal(200);
    expect(list.body.success).to.equal(true);
    expect(list.body.data).to.exist;

    const updated = await request(app)
      .put(`/api/conductor-put/${conductorId}`)
      .field("nombre", "Maria")
      .field("apellido", "Lopez")
      .field("tipoDocumento", "Cedula de ciudadania")
      .field("numDoc", "5248769845")
      .field("numTel", "3102223344")
      .attach("licencia", licenciaPath);

    expect(updated.status).to.equal(200);
    expect(updated.body.success).to.equal(true);

    expect(String(updated.body.data.numDoc)).to.equal("5248769845");

    const inact = await request(app)
      .patch(`/api/conductor-inactivar/${conductorId}`)
      .type("form")
      .send({ estado: "Inactivo" });

    expect(inact.status).to.equal(200);
    expect(inact.body.success).to.equal(true);

    if (inact.body.data?.estado) {
      expect(inact.body.data.estado).to.equal("Inactivo");
    }
  });
});
