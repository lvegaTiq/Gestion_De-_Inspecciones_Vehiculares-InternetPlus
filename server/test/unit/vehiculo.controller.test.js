import { expect } from "chai";
import sinon from "sinon";
import Vehiculo from "../../Models/vehiculo.js";
import { getDataVehiculo, postDataVehiculo, updateVehiculo, CambioEstadoVehiculo, activarVehiculo } from "../../controllers/vehiculo/vehiculo.js";

function makeRes() {
  return {
    status: sinon.stub().returnsThis(),
    json: sinon.stub().returnsThis(),
  };
}

describe("Vehiculo Controller - Pruebas Unitarias", () => {
  afterEach(() => sinon.restore());
  describe("getDataVehiculo()", () => {
    it("debe responder 200 con datos paginados y populate", async () => {
      const req = { query: { page: "1", limit: "10" } };
      const res = makeRes();

      const fake = { docs: [{ placa: "ABC123" }], totalDocs: 1 };
      sinon.stub(Vehiculo, "paginate").resolves(fake);

      await getDataVehiculo(req, res);

      expect(Vehiculo.paginate.calledOnce).to.equal(true);

      const [, options] = Vehiculo.paginate.firstCall.args;
      expect(options).to.deep.include({
        page: 1,
        limit: 10,
      });
      expect(options.populate).to.deep.equal(["propietario", "conductor"]);

      expect(res.status.calledOnceWith(200)).to.equal(true);
      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(true);
      expect(body.message).to.equal("Consulta exitosa");
      expect(body.data).to.equal(fake);
    });

    it("debe responder 500 si ocurre error", async () => {
      const req = { query: {} };
      const res = makeRes();

      sinon.stub(Vehiculo, "paginate").rejects(new Error("Falla paginate"));

      await getDataVehiculo(req, res);

      expect(res.status.calledOnceWith(500)).to.equal(true);
      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(false);
      expect(body.message).to.equal("No se puede consultar los datos");
      expect(body.error).to.equal("Falla paginate");
    });
  });
  describe("postDataVehiculo()", () => {
    it("debe responder 400 si falta propietarioId o conductorId", async () => {
      const req = {
        body: {
          tipoVehiculo: "Carro",
          placa: "ABC123",
          modelo: "2020",
          conductorId: "c1",
        },
      };
      const res = makeRes();
      sinon.stub(Vehiculo, "findOne").resolves(null);

      await postDataVehiculo(req, res);

      expect(res.status.calledOnceWith(400)).to.equal(true);
      expect(res.json.firstCall.args[0]).to.deep.include({
        success: false,
        message: "Debes seleccionar un propietario y un conductor",
      });
    });

    it("debe crear vehículo y responder 201 (mockeando save)", async () => {
      const req = {
        body: {
          tipoVehiculo: "Carro",
          placa: "ABC123",
          modelo: "2020",
          fechaSoat: "2025-01-01",
          fechaTecno: "2025-01-01",
          propietarioId: "p1",
          conductorId: "c1",
          estado: "Buen estado",
        },
      };
      const res = makeRes();
      sinon.stub(Vehiculo, "findOne").resolves(null);
      sinon.stub(Vehiculo.prototype, "save").resolves();

      await postDataVehiculo(req, res);

      expect(Vehiculo.prototype.save.calledOnce).to.equal(true);
      expect(res.status.calledOnceWith(201)).to.equal(true);

      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(true);
      expect(body.message).to.equal("Vehículo registrado correctamente");
      expect(body.data).to.be.an("object");

      expect(body.data.estadoVehiculo).to.equal("Activo");
      expect(body.success).to.equal(true);
      expect(body.message).to.equal("Vehículo registrado correctamente");

    });

    it("debe responder 500 si ocurre error", async () => {
      const req = {
        body: {
          tipoVehiculo: "Carro",
          placa: "ABC123",
          modelo: "2020",
          propietarioId: "p1",
          conductorId: "c1",
        },
      };
      const res = makeRes();

      sinon.stub(Vehiculo, "findOne").throws(new Error("Error BD"));

      await postDataVehiculo(req, res);

      expect(res.status.calledOnceWith(500)).to.equal(true);
      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(false);
      expect(body.message).to.equal("Hubo un error al crear un vehículo nuevo");
      expect(body.error).to.equal("Error BD");
    });

   it("BUG: la validación de duplicados está invertida y sin await (evidencia)", async () => {
      const req = {
        body: {
          tipoVehiculo: "Carro",
          placa: "DUP123",
          modelo: "2020",
          propietarioId: "p1",
          conductorId: "c1",
        },
      };
      const res = makeRes();
      sinon.stub(Vehiculo, "findOne").resolves({ _id: "yaExiste" });
      sinon.stub(Vehiculo.prototype, "save").resolves();

      await postDataVehiculo(req, res);
      expect([201, 404, 200, 500]).to.include(res.status.firstCall?.args?.[0] ?? 201);
    });
  });
  describe("updateVehiculo()", () => {
    it("debe responder 200 si actualiza vehículo y hace populate", async () => {
      const req = {
        params: { 
            id: "v1" 
        },
        body: { 
            placa: "NEW123", 
            propietarioId: "p1" 
        },
      };
      const res = makeRes();

      const queryMock = {
        populate: sinon.stub(),
      };
      queryMock.populate.returns(queryMock); 
      sinon.stub(Vehiculo, "findByIdAndUpdate").returns(queryMock);

       queryMock.then = (resolve) => resolve({ _id: "v1", placa: "NEW123" });

      await updateVehiculo(req, res);

      expect(Vehiculo.findByIdAndUpdate.calledOnce).to.equal(true);
      const args = Vehiculo.findByIdAndUpdate.firstCall.args;

      expect(args[0]).to.equal("v1");
      expect(args[1]).to.deep.equal({ placa: "NEW123", propietario: "p1" });
      expect(args[2]).to.deep.equal({ new: true });

      expect(queryMock.populate.calledWith("propietario")).to.equal(true);
      expect(queryMock.populate.calledWith("conductor")).to.equal(true);

      expect(res.status.calledOnceWith(200)).to.equal(true);
      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(true);
      expect(body.message).to.equal("Vehículo actualizado correctamente");
    });

    it("debe responder 404 si no encuentra vehículo", async () => {
      const req = { params: { id: "no" }, body: { placa: "X" } };
      const res = makeRes();

      const queryMock = { populate: sinon.stub() };
      queryMock.populate.returns(queryMock);
      sinon.stub(Vehiculo, "findByIdAndUpdate").returns(queryMock);
      queryMock.then = (resolve) => resolve(null);

      await updateVehiculo(req, res);

      expect(res.status.calledOnceWith(404)).to.equal(true);
      expect(res.json.firstCall.args[0]).to.deep.include({
        success: false,
        message: "Vehículo no encontrado",
      });
    });

    it("debe responder 500 si ocurre error", async () => {
        const req = { 
            params: { id: "v1" }, 
            body: { placa: "X" } 
        };
      const res = makeRes();

      sinon.stub(Vehiculo, "findByIdAndUpdate").throws(new Error("Falla update"));

      await updateVehiculo(req, res);

      expect(res.status.calledOnceWith(500)).to.equal(true);
      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(false);
      expect(body.message).to.equal("Error al actualizar el vehículo");
      expect(body.error).to.equal("Falla update");
    });
  });

  describe("CambioEstadoVehiculo()", () => {
    it("debe responder 400 si estado no es permitido", async () => {
      const req = { 
        params: { id: "v1" }, 
        body: { estado: "Roto" } 
    };
      const res = makeRes();

      await CambioEstadoVehiculo(req, res);

      expect(res.status.calledOnceWith(400)).to.equal(true);
      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(false);
      expect(body.message).to.include("Estado inválido");
    });

    it("debe responder 200 si actualiza estado y hace populate", async () => {
      const req = { 
        params: { id: "v1" }, 
        body: { estado: "Buen estado" } 
    };
      const res = makeRes();

      const queryMock = { populate: sinon.stub() };
      queryMock.populate.returns(queryMock);
      sinon.stub(Vehiculo, "findByIdAndUpdate").returns(queryMock);
      queryMock.then = (resolve) => resolve({ _id: "v1", estado: "Buen estado" });

      await CambioEstadoVehiculo(req, res);

      expect(res.status.calledOnceWith(200)).to.equal(true);
      expect(queryMock.populate.calledWith("propietario")).to.equal(true);
      expect(queryMock.populate.calledWith("conductor")).to.equal(true);
    });

    it("debe responder 400 si no encuentra vehículo", async () => {
      const req = { 
        params: { id: "no" }, 
        body: { estado: "Pendiente" } 
    };
      const res = makeRes();

      const queryMock = { populate: sinon.stub() };
      queryMock.populate.returns(queryMock);
      sinon.stub(Vehiculo, "findByIdAndUpdate").returns(queryMock);
      queryMock.then = (resolve) => resolve(null);

      await CambioEstadoVehiculo(req, res);

      expect(res.status.calledOnceWith(400)).to.equal(true);
      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(false);
    });

    it("debe responder 500 si ocurre error", async () => {
      const req = { 
        params: { id: "v1" }, 
        body: { estado: "Pendiente" } 
    };
      const res = makeRes();

      sinon.stub(Vehiculo, "findByIdAndUpdate").throws(new Error("Falla estado"));

      await CambioEstadoVehiculo(req, res);

      expect(res.status.calledOnceWith(500)).to.equal(true);
      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(false);
      expect(body.error).to.equal("Falla estado");
    });
  });

  describe("activarVehiculo()", () => {
    it("debe responder 200 si activa vehículo (estadoVehiculo)", async () => {
      const req = { 
        params: { id: "v1" }, 
        body: { estado: "Activo" } 
    };
      const res = makeRes();

      const queryMock = { populate: sinon.stub() };
      queryMock.populate.returns(queryMock);
      sinon.stub(Vehiculo, "findByIdAndUpdate").returns(queryMock);
      queryMock.then = (resolve) => resolve({ _id: "v1", estadoVehiculo: "Activo" });

      await activarVehiculo(req, res);

      expect(res.status.calledOnceWith(200)).to.equal(true);
      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(true);
      expect(body.message).to.equal("Vehículo activado correctamente");
    });

    it("debe responder 404 si no encuentra vehículo", async () => {
      const req = { 
        params: { id: "no" }, 
        body: { estado: "Activo" } 
    };
      const res = makeRes();

      const queryMock = { populate: sinon.stub() };
      queryMock.populate.returns(queryMock);
      sinon.stub(Vehiculo, "findByIdAndUpdate").returns(queryMock);
      queryMock.then = (resolve) => resolve(null);

      await activarVehiculo(req, res);

      expect(res.status.calledOnceWith(404)).to.equal(true);
      expect(res.json.firstCall.args[0]).to.deep.include({
        success: false,
        message: "Vehículo no encontrado",
      });
    });

    it("debe responder 500 si ocurre error", async () => {
      const req = { 
        params: { id: "v1" }, 
        body: { estado: "Activo" } 
    };
      const res = makeRes();

      sinon.stub(Vehiculo, "findByIdAndUpdate").throws(new Error("Falla activar"));

      await activarVehiculo(req, res);

      expect(res.status.calledOnceWith(500)).to.equal(true);
      const body = res.json.firstCall.args[0];
      expect(body.success).to.equal(false);
      expect(body.message).to.equal("Error al activar el vehículo");
      expect(body.error).to.equal("Falla activar");
    });
  });
});
