import request from "supertest";
import { expect } from "chai";
import app from "../../app.js";
import { connectTestDB, clearTestDB, closeTestDB } from "../integration/setup.db.js";

describe("SISTEMA - Users (flujo completo)", () => {
  let userId;
  const userPayload = {
    nombre: "Juan",
    apellido: "Pérez",
    tipoDocumento: "Cedula de ciudadania",
    documento: "2546521456",
    email: `juan.${Date.now()}@test.com`,
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

  it("Crear -> Listar -> Actualizar -> Inactivar", async () => {
    const created = await request(app).post("/api/users-post").send(userPayload);
    expect([200, 201]).to.include(created.status);
    expect(created.body.success).to.equal(true);
    userId = created.body.data._id;

    const list = await request(app).get("/api/users-get?page=1&limit=10");
    expect(list.status).to.equal(200);
    expect(list.body.success).to.equal(true);

    const updated = await request(app)
      .put(`/api/users-update/${userId}`)
      .send({ nombre: "Juan Actualizado" });

    expect(updated.status).to.equal(200);
    expect(updated.body.success).to.equal(true);
    expect(updated.body.data.nombre).to.equal("Juan Actualizado");

    const inact = await request(app)
      .patch(`/api/users-inactivar/${userId}`)
      .type("form")
      .send({ estado: "Inactivo" });

    expect(inact.status).to.equal(200);
    expect(inact.body.success).to.equal(true);
  });
});
