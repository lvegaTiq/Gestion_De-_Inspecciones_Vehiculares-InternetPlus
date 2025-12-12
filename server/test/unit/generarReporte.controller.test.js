import { expect } from "chai";
import sinon from "sinon";
import { PassThrough } from "stream";
import Estado from "../../Models/Estado.js";
import vehiculo from "../../Models/vehiculo.js";
import { getReportesEstado } from "../../controllers/generarReporteEstado.js";

function makeRes() {
  const stream = new PassThrough();
  const res = stream;
  res.setHeader = sinon.stub();
  res.status = sinon.stub().returnsThis();
  res.json = sinon.stub().returnsThis();
  res.headersSent = false;

  return res;
}

describe("Reporte Estado - getReportesEstado()", () => {
    afterEach(() => sinon.restore());
    it("debe responder 400 si no envían vehiculoId", async () => {
      const req = { params: {} };
      const res = makeRes();
      await getReportesEstado(req, res);
      expect(res.status.calledOnceWith(400)).to.equal(true);
      expect(res.json.firstCall.args[0]).to.deep.include({
        success: false,
        message: "Debe enviar el id del vehículo en la ruta.",
      });
    });

    it("debe responder 404 si no existe el vehículo", async () => {
      const req = { params: { vehiculoId: "v1" } };
      const res = makeRes();
      const q = { populate: sinon.stub(), lean: sinon.stub() };
      q.populate.returns(q);
      q.lean.resolves(null);
      sinon.stub(vehiculo, "findById").returns(q);
      await getReportesEstado(req, res);

      expect(res.status.calledOnceWith(404)).to.equal(true);
      expect(res.json.firstCall.args[0]).to.deep.include({
        success: false,
        message: "Vehículo no encontrado",
      });
    });

    it.skip("debe setear headers PDF y finalizar doc.end() cuando hay datos", async () => {
      const req = { params: { vehiculoId: "v1" } };
      const res = makeRes();

      const vehiculoDoc = {
        _id: "v1",
        placa: "ABC123",
        tipoVehiculo: "carro",
        modelo: "2020",
        estado: "Buen estado",
        propietario: { nombre: "Ana", apellido: "P" },
        conductor: { nombre: "Juan", apellido: "Q" },
      };
      const qVeh = { populate: sinon.stub(), lean: sinon.stub() };
      qVeh.populate.returns(qVeh);
      qVeh.lean.resolves(vehiculoDoc);
      sinon.stub(vehiculo, "findById").returns(qVeh);

      const estadosFake = [
        { FechaEstado: new Date("2025-01-01"), kilometraje: 1000, Observacion: "" },
        { FechaEstado: new Date("2025-02-01"), kilometraje: 1500, Observacion: "Fuga" },
      ];
      const qEst = { sort: sinon.stub(), lean: sinon.stub() };
      qEst.sort.returns(qEst);
      qEst.lean.resolves(estadosFake);
      sinon.stub(Estado, "find").returns(qEst);

      const PDFKit = await import("pdfkit");
      const original = PDFKit.default;

      const endStub = sinon.stub();
      const pipeStub = sinon.stub();
      const chain = {
        page: { width: 600, height: 800 },
        pipe: pipeStub,
        end: endStub,
        rect: sinon.stub().returnsThis(),
        fill: sinon.stub().returnsThis(),
        fillColor: sinon.stub().returnsThis(),
        fontSize: sinon.stub().returnsThis(),
        text: sinon.stub().returnsThis(),
        moveDown: sinon.stub().returnsThis(),
        roundedRect: sinon.stub().returnsThis(),
        addPage: sinon.stub().returnsThis(),
        moveTo: sinon.stub().returnsThis(),
        lineTo: sinon.stub().returnsThis(),
        strokeColor: sinon.stub().returnsThis(),
        stroke: sinon.stub().returnsThis(),
      };

      PDFKit.default = function FakePDFDocument() {
        return chain;
      };

      try {
        await getReportesEstado(req, res);

        expect(res.setHeader.calledWith("Content-Type", "application/pdf")).to.equal(true);
        expect(pipeStub.calledOnce).to.equal(true);
        expect(endStub.calledOnce).to.equal(true);
      } finally {
        PDFKit.default = original;
      }
    });

    it("debe setear headers PDF cuando hay datos (sin mockear pdfkit)", async () => {
      const req = { params: { vehiculoId: "v1" } };
      const res = makeRes();

      const vehiculoDoc = {
        _id: "v1",
        placa: "ABC123",
        tipoVehiculo: "carro",
        modelo: "2020",
        estado: "Buen estado",
        propietario: { nombre: "Ana", apellido: "P" },
        conductor: { nombre: "Juan", apellido: "Q" },
      };

      const qVeh = { populate: sinon.stub(), lean: sinon.stub() };
      qVeh.populate.returns(qVeh);
      qVeh.lean.resolves(vehiculoDoc);
      sinon.stub(vehiculo, "findById").returns(qVeh);

      const estadosFake = [
        { FechaEstado: new Date("2025-01-01"), kilometraje: 1000, Observacion: "" },
      ];
      const qEst = { sort: sinon.stub(), lean: sinon.stub() };
      qEst.sort.returns(qEst);
      qEst.lean.resolves(estadosFake);
      sinon.stub(Estado, "find").returns(qEst);

      await getReportesEstado(req, res);

      expect(res.setHeader.calledWith("Content-Type", "application/pdf")).to.equal(true);
      expect(res.setHeader.calledWithMatch("Content-Disposition", sinon.match.string)).to.equal(true);
    });

});
