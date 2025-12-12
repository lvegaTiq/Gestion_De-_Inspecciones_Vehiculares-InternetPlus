import request from "supertest";
import { expect } from "chai";
import app from "../../app.js";
import { connectTestDB, clearTestDB, closeTestDB } from "./setup.db.js";

describe("INTEGRACIÓN - Usuario", () => {
  let userId;

  const userPayload = {
    nombre: "Juan",
    apellido: "Pérez",
    tipoDocumento: "Cedula de ciudadania",
    documento: "2546521456",
    email: "juan@test.com",
    telefono: 3021548623,
    password: "123456",
    role: "Supervisor", 
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
    userId = undefined;
  });

  it("POST /api/users-post -> debe crear usuario", async () => {
    const res = await request(app)
      .post("/api/users-post")
      .send(userPayload);

    if (res.status !== 200) console.log("USER CREATE:", res.status, res.body);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal(true);
    expect(res.body.data).to.have.property("_id");
    userId = res.body.data._id;
  });

  it("GET /api/users-get -> debe listar usuarios", async () => {
    const created = await request(app)
      .post("/api/users-post")
      .send(userPayload);

    if (created.status !== 200) console.log("USER PRE-CREATE:", created.status, created.body);

    expect(created.status).to.equal(200);
    userId = created.body.data._id;

    const res = await request(app).get("/api/users-get?page=1&limit=10");
    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal(true);
    expect(res.body.data).to.exist;
  });

  it("PUT /api/users-update/:id -> debe actualizar usuario", async () => {
    const created = await request(app)
      .post("/api/users-post")
      .send(userPayload);

    expect(created.status).to.equal(200);
    userId = created.body.data._id;

    const res = await request(app)
      .put(`/api/users-update/${userId}`)
      .send({ nombre: "Juan Actualizado" });

    if (res.status !== 200) console.log("USER UPDATE:", res.status, res.body);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal(true);
    expect(res.body.data.nombre).to.equal("Juan Actualizado");
  });

  it("PATCH /api/users-inactivar/:id -> debe cambiar estado", async () => {
    const created = await request(app)
      .post("/api/users-post")
      .send(userPayload);

    expect(created.status).to.equal(200);
    userId = created.body.data._id;

    const res = await request(app)
      .patch(`/api/users-inactivar/${userId}`)
      .type("form")
      .send({ estado: "Inactivo" });

    if (res.status !== 200) console.log("USER INACTIVAR:", res.status, res.body);

    expect(res.status).to.equal(200);
    expect(res.body.success).to.equal(true);

    if (res.body.data?.estado) {
      expect(res.body.data.estado).to.equal("Inactivo");
    }
  });
});
