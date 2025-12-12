import request from "supertest";
import { expect } from "chai";
import app from "../../app.js";
import { connectTestDB, clearTestDB, closeTestDB } from "../integration/setup.db.js";

describe("SISTEMA - Propietario (flujo completo)", () => {
  let propietarioId;

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
  });

  it("Crear -> Listar -> Actualizar -> Inactivar", async () => {
    const created = await request(app)
      .post("/api/propietario-post")
      .send(propietarioPayload);

    expect([200, 201]).to.include(created.status);
    expect(created.body.success).to.equal(true);
    expect(created.body.data).to.have.property("_id");

    propietarioId = created.body.data._id;

    const list = await request(app).get("/api/propietario-get?page=1&limit=10");
    expect(list.status).to.equal(200);
    expect(list.body.success).to.equal(true);
    expect(list.body.data).to.exist;

    const updated = await request(app)
      .put(`/api/propietario-put/${propietarioId}`)
      .send({ numTel: 999 });

    expect(updated.status).to.equal(200);
    expect(updated.body.success).to.equal(true);
    expect(updated.body.data.numTel).to.equal(999);

    const inact = await request(app)
      .patch(`/api/propietario-patch/${propietarioId}`)
      .send({ estado: "Inactivo" });

    expect(inact.status).to.equal(200);
    expect(inact.body.success).to.equal(true);

    if (inact.body.data?.estado) {
      expect(inact.body.data.estado).to.equal("Inactivo");
    }
  });
});
