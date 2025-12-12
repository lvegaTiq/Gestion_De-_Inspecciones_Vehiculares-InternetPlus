import { expect } from "chai";
import sinon from "sinon";
import Estado from "../../Models/Estado.js";
import Vehiculo from "../../Models/vehiculo.js";
import { getDataEstadoVehiculo, postDataEstadoVehiculo } from "../../controllers/Estado_vehiculo/estado_vehiculo.js";

function makeRes() {
  return {
    status: sinon.stub().returnsThis(),
    json: sinon.stub().returnsThis(),
  };
}

describe("EstadoVehiculo Controller - Pruebas Unitarias", () => {
    beforeEach(() => sinon.stub(console, "error"));
    afterEach(() => sinon.restore());
    describe("getDataEstadoVehiculo()", () => {
        it("debe responder 200 con estados paginados", async () => {
          const req = { query: { page: "1", limit: "10" } };
          const res = makeRes();

          const fake = { docs: [{ kilometraje: 1000 }], totalDocs: 1 };
          sinon.stub(Estado, "paginate").resolves(fake);

          await getDataEstadoVehiculo(req, res);

          expect(Estado.paginate.calledOnce).to.equal(true);

          const [, options] = Estado.paginate.firstCall.args;
          expect(options).to.deep.include({ page: 1, limit: 10 });
          expect(options.populate).to.deep.equal(["Vehiculo"]);

          expect(res.status.calledOnceWith(200)).to.equal(true);
          const body = res.json.firstCall.args[0];
          expect(body.success).to.equal(true);
          expect(body.message).to.equal("Consulta exitosa");
          expect(body.data).to.equal(fake);
        });

        it("debe responder 500 si ocurre error", async () => {
          const req = { query: {} };
          const res = makeRes();

          sinon.stub(Estado, "paginate").rejects(new Error("Falla paginate"));

          await getDataEstadoVehiculo(req, res);

          expect(res.status.calledOnceWith(500)).to.equal(true);
          const body = res.json.firstCall.args[0];
          expect(body.success).to.equal(false);
          expect(body.message).to.equal("Ocurrió un error al consultar");
          expect(body.error).to.equal("Falla paginate");
        });
    });

    describe("postDataEstadoVehiculo()", () => {
    it("debe responder 400 si no envían vehiculoId", async () => {
      const req = { body: { Observacion: "" } };
      const res = makeRes();

      await postDataEstadoVehiculo(req, res);

      expect(res.status.calledOnceWith(400)).to.equal(true);
      expect(res.json.firstCall.args[0]).to.deep.include({
        success: false,
        message: "Debe ingresar el id del vehiculo.",
      });
    });

    it("debe responder 404 si no existe el vehículo", async () => {
      const req = {
        body: {
          vehiculoId: "v1",
          Observacion: "",
        },
      };
      const res = makeRes();

      sinon.stub(Vehiculo, "findById").resolves(null);

      await postDataEstadoVehiculo(req, res);

      expect(Vehiculo.findById.calledOnceWith("v1")).to.equal(true);
      expect(res.status.calledOnceWith(404)).to.equal(true);
      expect(res.json.firstCall.args[0]).to.deep.include({
        success: false,
        message: "Vehiculo no encontrado",
      });
    });

    it("debe crear estado y poner vehículo en 'Buen estado' si Observacion está vacía", async () => {
      const req = {
        body: {
          FechaEstado: "2025-01-01",
          kilometraje: 1000,
          Nivel: "OK",
          pedal: "OK",
          Luz: "OK",
          botiquin: "OK",
          varios: "OK",
          Observacion: "   ",
          vehiculoId: "v1",
        },
      };
      const res = makeRes();

      const vehiculoDoc = { estado: "Pendiente", save: sinon.stub().resolves() };
      sinon.stub(Vehiculo, "findById").resolves(vehiculoDoc);

      sinon.stub(Estado.prototype, "save").resolves();

      await postDataEstadoVehiculo(req, res);

      expect(Estado.prototype.save.calledOnce).to.equal(true);
      expect(vehiculoDoc.save.calledOnce).to.equal(true);

      expect(vehiculoDoc.estado).to.equal("Buen estado");

      expect(res.status.calledOnceWith(201)).to.equal(true);
      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(true);
      expect(body.message).to.equal("El estado fue registrado correctamente");
      expect(body.estadoVehiculo).to.equal("Buen estado");
      expect(body.data).to.be.an("object");
    });

    it("debe crear estado y poner vehículo en 'Mal estado' si Observacion tiene texto", async () => {
      const req = {
        body: {
          FechaEstado: "2025-01-01",
          kilometraje: 1000,
          Observacion: "Fuga de aceite",
          vehiculoId: "v1",
        },
      };
      const res = makeRes();

      const vehiculoDoc = { estado: "Pendiente", save: sinon.stub().resolves() };
      sinon.stub(Vehiculo, "findById").resolves(vehiculoDoc);

      sinon.stub(Estado.prototype, "save").resolves();

      await postDataEstadoVehiculo(req, res);

      expect(vehiculoDoc.estado).to.equal("Mal estado");
      expect(res.status.calledOnceWith(201)).to.equal(true);

      const body = res.json.firstCall.args[0];
      expect(body.estadoVehiculo).to.equal("Mal estado");
    });

    it("debe responder 500 si ocurre error", async () => {
      const req = {
        body: {
          vehiculoId: "v1",
          Observacion: "",
        },
      };
      const res = makeRes();

      sinon.stub(Vehiculo, "findById").rejects(new Error("Error BD"));

      await postDataEstadoVehiculo(req, res);

      expect(res.status.calledOnceWith(500)).to.equal(true);
      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(false);
      expect(body.message).to.equal("No se puede crear el estado del vehiculo");
      expect(body.error).to.equal("Error BD");
    });
  });
});
