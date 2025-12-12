import request from "supertest";
import { expect } from "chai";
import app from "../../app.js";
import { connectTestDB, clearTestDB, closeTestDB } from "./setup.db.js";

const propietarioPayload = {
  nombre: "Ana",
  apellido: "Lopez",
  tipoDoc: "Cedula de ciudadania",
  numDoc: 111,
  numTel: 300,
  estado: "Activo",
};


describe("INTEGRACIÓN - Propietario", () => {
  let propietarioId;

  before(async () => {
    await connectTestDB();
  });

  after(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  it("POST /api/propietario-post -> debe crear propietario", async () => {
    const res = await request(app)
      .post("/api/propietario-post")
      .send({
        nombre: "Ana",
        apellido: "Lopez",
        tipoDoc: "Cedula de ciudadania",
        numDoc: "111",
        numTel: "300",
        estado: "Activo",
      });

    if (res.status !== 201) console.log("PROP CREATE:", res.status, res.body);

    expect(res.status).to.equal(201);
    expect(res.body.success).to.equal(true);
    propietarioId = res.body.data._id;
  });

  it("GET /api/propietario-get -> debe listar propietarios", async () => {
    const created = await request(app).post("/api/propietario-post").send({
      nombre: "Ana",
      apellido: "Lopez",
      tipoDoc: "Cedula de ciudadania",
      numDoc: "111",
      numTel: "300",
      estado: "Activo",
    });
    propietarioId = created.body.data._id;

    const res = await request(app).get("/api/propietario-get?page=1&limit=10");
    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal(true);
    expect(res.body.data).to.be.an("object");
  });

  it("PUT /api/propietario-put/:id -> debe actualizar propietario", async () => {
    const created = await request(app)
      .post("/api/propietario-post")
      .send(propietarioPayload);

    expect(created.status).to.equal(201);
    propietarioId = created.body.data._id;

    const res = await request(app)
      .put(`/api/propietario-put/${propietarioId}`)
      .send({ numTel: 999 });

    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal(true);
    expect(res.body.data.numTel).to.equal(999);
  });

  it("PATCH /api/propietario-patch/:id -> debe cambiar estado", async () => {
      const created = await request(app)
        .post("/api/propietario-post")
        .send(propietarioPayload);

      expect(created.status).to.equal(201);
      expect(created.body.data).to.have.property("_id");

      propietarioId = created.body.data._id;

      const res = await request(app)
        .patch(`/api/propietario-patch/${propietarioId}`)
        .send({ estado: "Inactivo" });

      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
      expect(res.body.data.estado).to.equal("Inactivo");
    });

});
