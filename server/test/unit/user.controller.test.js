import { expect } from "chai";
import sinon from "sinon";

import user from "../../Models/users.js";
import { getData, create, actualizar, inactivarUsuario } from "../../controllers/users/Users.js";

function makeRes() {
  return {
    status: sinon.stub().returnsThis(),
    json: sinon.stub().returnsThis(),
  };
}

describe("Users Controller - Pruebas Unitarias", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("getData()", () => {
    it("debe responder 200 con usuarios paginados", async () => {
      const req = { query: { page: "1", limit: "10" } };
      const res = makeRes();

      const fakeUsers = { docs: [{ email: "a@a.com" }], totalDocs: 1 };
      sinon.stub(user, "paginate").resolves(fakeUsers);

      await getData(req, res);

      expect(user.paginate.calledOnce).to.equal(true);
      expect(res.status.calledOnceWith(200)).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);

      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(true);
      expect(body.data).to.equal(fakeUsers);
    });

    it("debe responder 500 si ocurre error", async () => {
      const req = { query: {} };
      const res = makeRes();

      sinon.stub(user, "paginate").rejects(new Error("Falla paginate"));

      await getData(req, res);

      expect(res.status.calledOnceWith(500)).to.equal(true);
      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(false);
      expect(body.error).to.equal("Falla paginate");
    });
  });

  describe("create()", () => {
    it("debe responder 400 si body está vacío", async () => {
      const req = { body: {} };
      const res = makeRes();

      await create(req, res);

      expect(res.status.calledOnceWith(400)).to.equal(true);
      expect(res.json.firstCall.args[0]).to.deep.include({
        success: false,
        message: "Body vacío",
      });
    });

    it("debe responder 400 si usuario ya existe (email o documento)", async () => {
      const req = {
        body: {
          nombre: "Juan",
          apellido: "Perez",
          tipoDocumento: "CC",
          documento: "123",
          email: "a@a.com",
          estado: true,
          telefono: "300",
          password: "123",
          role: "admin",
        },
      };
      const res = makeRes();

      sinon.stub(user, "findOne").resolves({ _id: "existe" });

      await create(req, res);

      expect(user.findOne.calledOnce).to.equal(true);
      expect(res.status.calledOnceWith(400)).to.equal(true);
      expect(res.json.firstCall.args[0]).to.deep.include({
        success: false,
        message: "El usuario ya existe en la base de datos",
      });
    });

    it("debe responder 400 si documento es obligatorio (vacío)", async () => {
      const req = {
        body: {
          nombre: "Juan",
          apellido: "Perez",
          tipoDocumento: "CC",
          documento: "   ",
          email: "a@a.com",
          estado: true,
          telefono: "300",
          password: "123",
          role: "admin",
        },
      };
      const res = makeRes();

      sinon.stub(user, "findOne").resolves(null);

      await create(req, res);

      expect(res.status.calledOnceWith(400)).to.equal(true);
      expect(res.json.firstCall.args[0]).to.deep.include({
        success: false,
        message: "Documento obligatorio",
      });
    });

    it("debe responder 200 si crea usuario correctamente", async () => {
      const req = {
        body: {
          nombre: "Juan",
          apellido: "Perez",
          tipoDocumento: "CC",
          documento: "123",
          email: "a@a.com",
          estado: true,
          telefono: "300",
          password: "123",
          role: "admin",
        },
      };
      const res = makeRes();

      sinon.stub(user, "findOne").resolves(null);

      sinon.stub(user.prototype, "save").resolves();

      await create(req, res);

      expect(user.findOne.calledOnce).to.equal(true);
      expect(user.prototype.save.calledOnce).to.equal(true);
      expect(res.status.calledOnceWith(200)).to.equal(true);

      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(true);
      expect(body.message).to.equal("Usuario creado exitosamente");
      expect(body.data).to.be.an("object");
    });

    it("debe responder 500 si ocurre error en create()", async () => {
      const req = {
        body: {
          nombre: "Juan",
          apellido: "Perez",
          tipoDocumento: "CC",
          documento: "123",
          email: "a@a.com",
          estado: true,
          telefono: "300",
          password: "123",
          role: "admin",
        },
      };
      const res = makeRes();

      sinon.stub(user, "findOne").rejects(new Error("Error BD"));

      await create(req, res);

      expect(res.status.calledOnceWith(500)).to.equal(true);
      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(false);
      expect(body.message).to.equal("El usuario no se pudo crear");
      expect(body.error).to.equal("Error BD");
    });
  });

  describe("actualizar()", () => {
    it("debe responder 200 si actualiza usuario", async () => {
      const req = {
        params: { id: "abc123" },
        body: { nombre: "NuevoNombre", telefono: "999" },
      };
      const res = makeRes();

      sinon.stub(user, "findByIdAndUpdate").resolves({ _id: "abc123", nombre: "NuevoNombre" });

      await actualizar(req, res);

      expect(user.findByIdAndUpdate.calledOnce).to.equal(true);

      // Verifica que solo mandó los campos que vienen
      const args = user.findByIdAndUpdate.firstCall.args;
      expect(args[0]).to.equal("abc123");
      expect(args[1]).to.deep.equal({ nombre: "NuevoNombre", telefono: "999" });

      expect(res.status.calledOnceWith(200)).to.equal(true);
      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(true);
      expect(body.message).to.equal("Usuario actualizado correctamente");
    });

    it("debe responder 404 si no encuentra usuario", async () => {
      const req = { params: { id: "noexiste" }, body: { nombre: "X" } };
      const res = makeRes();

      sinon.stub(user, "findByIdAndUpdate").resolves(null);

      await actualizar(req, res);

      expect(res.status.calledOnceWith(404)).to.equal(true);
      expect(res.json.firstCall.args[0]).to.deep.include({
        success: false,
        message: "Propioetario no encontrado",
      });
    });

    it("debe responder 500 si ocurre error", async () => {
      const req = { params: { id: "abc" }, body: { nombre: "X" } };
      const res = makeRes();

      sinon.stub(user, "findByIdAndUpdate").rejects(new Error("Falla update"));

      await actualizar(req, res);

      expect(res.status.calledOnceWith(500)).to.equal(true);
      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(false);
      expect(body.error).to.equal("Falla update");
    });
  });

  describe("inactivarUsuario()", () => {
    it("debe responder 200 si cambia estado", async () => {
      const req = { params: { id: "abc" }, body: { estado: false } };
      const res = makeRes();

      sinon.stub(user, "findByIdAndUpdate").resolves({ _id: "abc", estado: false });

      await inactivarUsuario(req, res);

      expect(user.findByIdAndUpdate.calledOnce).to.equal(true);
      expect(res.status.calledOnceWith(200)).to.equal(true);

      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(true);
      expect(body.message).to.equal("Cambio de estado exitoso");
    });

    it("debe responder 404 si usuario no existe", async () => {
      const req = { params: { id: "noexiste" }, body: { estado: false } };
      const res = makeRes();

      sinon.stub(user, "findByIdAndUpdate").resolves(null);

      await inactivarUsuario(req, res);

      expect(res.status.calledOnceWith(404)).to.equal(true);
      expect(res.json.firstCall.args[0]).to.deep.include({
        success: false,
        message: "Usuario no encontrado",
      });
    });

    it("debe responder 500 si ocurre error", async () => {
      const req = { params: { id: "abc" }, body: { estado: false } };
      const res = makeRes();

      sinon.stub(user, "findByIdAndUpdate").rejects(new Error("Falla estado"));

      await inactivarUsuario(req, res);

      expect(res.status.calledOnceWith(500)).to.equal(true);
      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(false);
      expect(body.message).to.equal("No se pudo inactivar el usuario ");
    });
  });
});
