import { expect } from "chai";
import sinon from "sinon";
import Conductor from "../../Models/conductor.js";
import { getDataConductor, postDataConductor, updateDataConductor, InactivarDataConductor } from "../../controllers/conductor/conductor.js"; 

function makeRes() {
  return {
    status: sinon.stub().returnsThis(),
    json: sinon.stub().returnsThis(),
  };
}

describe("Controlador de conductor - Pruebas Unitarias", () => {
    beforeEach(() => sinon.stub(console, "error"));
  afterEach(() => sinon.restore());

  describe("getDataConductor()", () => {
    it("debe responder 200 con datos paginados", async () => {
      const req = { query: { page: "1", limit: "10" } };
      const res = makeRes();
      const fake = { docs: [{ nombre: "Ana" }], totalDocs: 1 };
      sinon.stub(Conductor, "paginate").resolves(fake);

      await getDataConductor(req, res);

      expect(Conductor.paginate.calledOnce).to.equal(true);
      expect(res.status.calledOnceWith(200)).to.equal(true);

      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(true);
      expect(body.data).to.equal(fake);
    });

    it("debe responder 500 si ocurre error", async () => {
      const req = { query: {} };
      const res = makeRes();

      sinon.stub(Conductor, "paginate").rejects(new Error("Falla paginate"));

      await getDataConductor(req, res);

      expect(res.status.calledOnceWith(500)).to.equal(true);
      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(false);
      expect(body.error).to.equal("Falla paginate");
    });
  });

  describe("postDataConductor()", () => {
    it("debe responder 400 si body está vacío", async () => {
      const req = { body: {} };
      const res = makeRes();

      await postDataConductor(req, res);

      expect(res.status.calledOnceWith(400)).to.equal(true);
      expect(res.json.firstCall.args[0]).to.deep.include({
        success: false,
        message: "Body vacío",
      });
    });

    it("debe responder 400 si conductor ya existe por numDoc", async () => {
      const req = {
        body: {
          nombre: "Juan",
          apellido: "P",
          tipoDocumento: "CC",
          numDoc: "123",
          numTel: "300",
          estado: "Activo",
        },
      };
      const res = makeRes();

      sinon.stub(Conductor, "findOne").resolves({ _id: "existe" });

      await postDataConductor(req, res);

      expect(Conductor.findOne.calledOnceWith({ numDoc: "123" })).to.equal(true);
      expect(res.status.calledOnceWith(400)).to.equal(true);

      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(false);
      expect(body.message).to.equal("Este conductor con documento 123 ya existe");
    });

    it("debe responder 201 si crea conductor sin archivo (licencia null) y estado por defecto Activo", async () => {
      const req = {
        body: {
          nombre: "Juan",
          apellido: "P",
          tipoDocumento: "CC",
          numDoc: "123",
          numTel: "300",
        },
      };
      const res = makeRes();

      sinon.stub(Conductor, "findOne").resolves(null);
      sinon.stub(Conductor.prototype, "save").resolves();

      await postDataConductor(req, res);

      expect(Conductor.findOne.calledOnce).to.equal(true);
      expect(Conductor.prototype.save.calledOnce).to.equal(true);
      expect(res.status.calledOnceWith(201)).to.equal(true);

      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(true);
      expect(body.message).to.equal("Conductor creado exitosamente");
      expect(body.data).to.be.an("object");
    });

    it("debe responder 201 si crea conductor con archivo (licenciaPath asignada)", async () => {
      const req = {
        body: {
          nombre: "Juan",
          apellido: "P",
          tipoDocumento: "CC",
          numDoc: "123",
          numTel: "300",
          estado: "Activo",
        },
        file: { filename: "licencia.png" },
      };
      const res = makeRes();

      sinon.stub(Conductor, "findOne").resolves(null);
      sinon.stub(Conductor.prototype, "save").resolves();

      await postDataConductor(req, res);

      expect(res.status.calledOnceWith(201)).to.equal(true);
      const body = res.json.firstCall.args[0];

      expect(body.data.licencia).to.equal("/uploads/conductores/licencia.png");
    });

    it("debe responder 500 si ocurre error", async () => {
      const req = {
        body: {
          nombre: "Juan",
          apellido: "P",
          tipoDocumento: "CC",
          numDoc: "123",
          numTel: "300",
          estado: "Activo",
        },
      };
      const res = makeRes();

      sinon.stub(Conductor, "findOne").rejects(new Error("Error BD"));

      await postDataConductor(req, res);

      expect(res.status.calledOnceWith(500)).to.equal(true);
      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(false);
      expect(body.message).to.equal("No se pudo crear el conductor");
      expect(body.error).to.equal("Error BD");
    });
  });

  describe("updateDataConductor()", () => {
    it("debe responder 200 y actualizar conductor (incluyendo licencia si hay req.file)", async () => {
      const req = {
        params: { id: "abc" },
        body: {
          nombre: "Nuevo",
          numTel: "999",
        },
        file: { filename: "nueva.png" },
      };
      const res = makeRes();

      sinon
        .stub(Conductor, "findByIdAndUpdate")
        .resolves({ _id: "abc", nombre: "Nuevo" });

      await updateDataConductor(req, res);

      expect(Conductor.findByIdAndUpdate.calledOnce).to.equal(true);

      const args = Conductor.findByIdAndUpdate.firstCall.args;
      expect(args[0]).to.equal("abc");
      expect(args[1]).to.deep.equal({
        nombre: "Nuevo",
        numTel: "999",
        licencia: "/uploads/conductores/nueva.png",
      });
      expect(args[2]).to.deep.equal({ new: true });

      expect(res.status.calledOnceWith(200)).to.equal(true);
      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(true);
      expect(body.message).to.equal("Conductor actualizado correctamente");
    });

    it("debe responder 404 si no existe conductor", async () => {
      const req = { params: { id: "no" }, body: { nombre: "X" } };
      const res = makeRes();

      sinon.stub(Conductor, "findByIdAndUpdate").resolves(null);

      await updateDataConductor(req, res);

      expect(res.status.calledOnceWith(404)).to.equal(true);
      expect(res.json.firstCall.args[0]).to.deep.include({
        success: false,
        message: "Conductor no encontrado",
      });
    });

    it("debe responder 500 si ocurre error", async () => {
      const req = { params: { id: "abc" }, body: { nombre: "X" } };
      const res = makeRes();

      sinon
        .stub(Conductor, "findByIdAndUpdate")
        .rejects(new Error("Falla update"));

      await updateDataConductor(req, res);

      expect(res.status.calledOnceWith(500)).to.equal(true);
      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(false);
      expect(body.message).to.equal("Error al actualizar el conductor");
      expect(body.error).to.equal("Falla update");
    });
  });

  describe("InactivarDataConductor()", () => {
    it("debe responder 200 si inactiva conductor", async () => {
      const req = { params: { id: "abc" }, body: { estado: "Inactivo" } };
      const res = makeRes();

      sinon
        .stub(Conductor, "findByIdAndUpdate")
        .resolves({ _id: "abc", estado: "Inactivo" });

      await InactivarDataConductor(req, res);

      expect(Conductor.findByIdAndUpdate.calledOnce).to.equal(true);
      expect(res.status.calledOnceWith(200)).to.equal(true);

      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(true);
      expect(body.message).to.equal("Conductor inactivado correctamente");
    });

    it("debe responder 404 si no encuentra conductor", async () => {
      const req = { params: { id: "no" }, body: { estado: "Inactivo" } };
      const res = makeRes();

      sinon.stub(Conductor, "findByIdAndUpdate").resolves(null);

      await InactivarDataConductor(req, res);

      expect(res.status.calledOnceWith(404)).to.equal(true);
      expect(res.json.firstCall.args[0]).to.deep.include({
        success: false,
        message: "Conductor no encontrado",
      });
    });

    it("debe responder 500 si ocurre error", async () => {
      const req = { params: { id: "abc" }, body: { estado: "Inactivo" } };
      const res = makeRes();

      sinon
        .stub(Conductor, "findByIdAndUpdate")
        .rejects(new Error("Falla inactivar"));

      await InactivarDataConductor(req, res);

      expect(res.status.calledOnceWith(500)).to.equal(true);
      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(false);
      expect(body.message).to.equal("Error al inactivar el conductor");
      expect(body.error).to.equal("Falla inactivar");
    });
  });
});
