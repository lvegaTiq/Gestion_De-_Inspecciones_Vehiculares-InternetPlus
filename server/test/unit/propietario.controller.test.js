import { expect } from "chai";
import sinon from "sinon";
import propietario from "../../Models/propietario.js";
import { getDataPropietario, postDataPropietario, updateDataPropietario, CambiarEstado } from "../../controllers/propietario/propietario.js";

function makeRes() {
  return {
    status: sinon.stub().returnsThis(),
    json: sinon.stub().returnsThis(),
  };
}

describe("Controlador de propietario - Pruebas unitarias", () => {
  afterEach(() => sinon.restore());

  describe("getDataPropietario()", () => {
    it("debe responder 200 con propietarios paginados", async () => {
      const req = { query: { page: "1", limit: "10" } };
      const res = makeRes();

      const fake = { docs: [{ nombre: "Ana" }], totalDocs: 1 };
      sinon.stub(propietario, "paginate").resolves(fake);

      await getDataPropietario(req, res);

      expect(propietario.paginate.calledOnce).to.equal(true);
      expect(res.status.calledOnceWith(200)).to.equal(true);

      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(true);
      expect(body.data).to.equal(fake);
    });

    it("debe responder 500 si ocurre error", async () => {
      const req = { query: {} };
      const res = makeRes();

      sinon.stub(propietario, "paginate").rejects(new Error("Falla paginate"));

      await getDataPropietario(req, res);

      expect(res.status.calledOnceWith(500)).to.equal(true);
      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(false);
      expect(body.error).to.equal("Falla paginate");
    });
  });

  describe("postDataPropietario()", () => {
    it("debe responder 400 si ya existe por numDoc", async () => {
      const req = {
        body: {
          nombre: "Juan",
          apellido: "P",
          tipoDoc: "CC",
          numDoc: "123",
          numTel: "300",
          estado: "Activo",
        },
      };
      const res = makeRes();

      sinon.stub(propietario, "findOne").resolves({ _id: "existe" });

      await postDataPropietario(req, res);

      expect(propietario.findOne.calledOnceWith({ numDoc: "123" })).to.equal(true);
      expect(res.status.calledOnceWith(400)).to.equal(true);

      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(false);
      expect(body.message).to.equal("El propietario con CC 123 ya existe");
    });

    it("debe responder 201 si crea propietario y estado por defecto Activo", async () => {
      const req = {
        body: {
          nombre: "Juan",
          apellido: "P",
          tipoDoc: "CC",
          numDoc: "123",
          numTel: "300",
        },
      };
      const res = makeRes();

      sinon.stub(propietario, "findOne").resolves(null);
      sinon.stub(propietario.prototype, "save").resolves();

      await postDataPropietario(req, res);

      expect(propietario.findOne.calledOnce).to.equal(true);
      expect(propietario.prototype.save.calledOnce).to.equal(true);
      expect(res.status.calledOnceWith(201)).to.equal(true);

      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(true);
      expect(body.message).to.equal("Propietario creado correctamente");
      expect(body.data).to.be.an("object");
      expect(body.data.estado).to.equal("Activo");
    });

    it("debe responder 500 si ocurre error al crear", async () => {
      const req = {
        body: {
          nombre: "Juan",
          apellido: "P",
          tipoDoc: "CC",
          numDoc: "123",
          numTel: "300",
        },
      };
      const res = makeRes();

      sinon.stub(propietario, "findOne").rejects(new Error("Error BD"));

      await postDataPropietario(req, res);

      expect(res.status.calledOnceWith(500)).to.equal(true);
      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(false);
      expect(body.message).to.equal("No se pudo crear el propietario");
      expect(body.error).to.equal("Error BD");
    });
  });

  describe("updateDataPropietario()", () => {
    it("debe responder 400 si numDoc ya existe en otro propietario", async () => {
      const req = {
        params: { id: "abc" },
        body: { numDoc: "999", nombre: "Nuevo" },
      };
      const res = makeRes();

      sinon.stub(propietario, "findOne").resolves({ _id: "otro" });

      await updateDataPropietario(req, res);

      expect(propietario.findOne.calledOnce).to.equal(true);
      expect(res.status.calledOnceWith(400)).to.equal(true);

      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(false);
      expect(body.message).to.equal("Ya existe un propietario con el documento 999");
    });

    it("debe responder 200 si actualiza correctamente", async () => {
      const req = {
        params: { id: "abc" },
        body: { nombre: "Nuevo", numTel: "999" },
      };
      const res = makeRes();

      sinon.stub(propietario, "findByIdAndUpdate").resolves({ _id: "abc", nombre: "Nuevo" });

      await updateDataPropietario(req, res);

      expect(propietario.findByIdAndUpdate.calledOnce).to.equal(true);

      const args = propietario.findByIdAndUpdate.firstCall.args;
      expect(args[0]).to.equal("abc");
      expect(args[1]).to.deep.equal({ nombre: "Nuevo", numTel: "999" });
      expect(args[2]).to.deep.equal({ new: true });

      expect(res.status.calledOnceWith(200)).to.equal(true);
      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(true);
      expect(body.message).to.equal("Propietario actualizado correctamente");
    });

    it("debe responder 404 si no encuentra propietario", async () => {
      const req = { params: { id: "no" }, body: { nombre: "X" } };
      const res = makeRes();

      sinon.stub(propietario, "findByIdAndUpdate").resolves(null);

      await updateDataPropietario(req, res);

      expect(res.status.calledOnceWith(404)).to.equal(true);
      expect(res.json.firstCall.args[0]).to.deep.include({
        success: false,
        message: "Propietario no encontrado",
      });
    });

    it("debe responder 500 si ocurre error", async () => {
      const req = { params: { id: "abc" }, body: { nombre: "X" } };
      const res = makeRes();

      sinon.stub(propietario, "findByIdAndUpdate").rejects(new Error("Falla update"));

      await updateDataPropietario(req, res);

      expect(res.status.calledOnceWith(500)).to.equal(true);
      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(false);
      expect(body.message).to.equal("Error al actualizar el propietario");
      expect(body.error).to.equal("Falla update");
    });
  });

  describe("CambiarEstado()", () => {
    it("debe responder 200 si cambia estado correctamente", async () => {
      const req = { params: { id: "abc" }, body: { estado: "Inactivo" } };
      const res = makeRes();

      sinon.stub(propietario, "findByIdAndUpdate").resolves({ _id: "abc", estado: "Inactivo" });

      await CambiarEstado(req, res);

      expect(propietario.findByIdAndUpdate.calledOnce).to.equal(true);
      expect(res.status.calledOnceWith(200)).to.equal(true);

      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(true);
      expect(body.message).to.equal("Propietario inactivado correctamente");
    });

    it("debe responder 404 si no encuentra propietario", async () => {
      const req = { params: { id: "no" }, body: { estado: "Inactivo" } };
      const res = makeRes();

      sinon.stub(propietario, "findByIdAndUpdate").resolves(null);

      await CambiarEstado(req, res);

      expect(res.status.calledOnceWith(404)).to.equal(true);
      expect(res.json.firstCall.args[0]).to.deep.include({
        success: false,
        message: "Propietario no encontrado",
      });
    });

    it("debe responder 500 si ocurre error", async () => {
      const req = { params: { id: "abc" }, body: { estado: "Inactivo" } };
      const res = makeRes();

      sinon.stub(propietario, "findByIdAndUpdate").rejects(new Error("Falla estado"));

      await CambiarEstado(req, res);

      expect(res.status.calledOnceWith(500)).to.equal(true);
      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(false);
      expect(body.message).to.equal("Error al inactivar el propietario");
      expect(body.error).to.equal("Falla estado");
    });
  });
});
