import request from "supertest";
import { expect } from "chai";
import path from "path";
import fs from "fs";
import app from "../../app.js";
import { connectTestDB, clearTestDB, closeTestDB } from "./setup.db.js";

describe("INTEGRACIÓN - Estado", () => {
  let propietarioId;
  let conductorId;
  let vehiculoId;

  const licenciaPath = path.resolve(process.cwd(), "test", "assets", "licencia.jpg");

  const propietarioPayload = {
    nombre: "Ana",
    apellido: "Lopez",
    tipoDoc: "Cedula de ciudadania",
    numDoc: 111,
    numTel: 300,
    estado: "Activo",
  };

  const baseEstadoPayload = {
    FechaEstado: "2025-12-12",
    kilometraje: 120000,
    Nivel: [
      {
        limpiavidrios: true,
        AceiteMotor: true,
        LiquidoFrenos: true,
        LiquidoRefrigerante: true,
        NivelLiquidoHidraulico: true,
      },
    ],
    pedal: [{ frenos: true, Acelerador: true, clutsh: true }],
    Luz: [
      {
        Direccional: true,
        luces: true,
        lucesInternas: true,
        estacionarias: true,
        stops: true,
        testigos: true,
        LuzReversa: true,
      },
    ],
    botiquin: [
      {
        extintor: true,
        fechaVencimiento: "2025-10-10",
        llantaRepuesto: true,
        CrucetaAcordePernos: true,
        Señales: true,
        tacos: true,
        cajaHerramientas: true,
        linterna: true,
        gato: true,
        botiquinPrimerosAuxilios: true,
      },
    ],
    varios: [
      {
        llantas: true,
        bateria: true,
        rines: true,
        cinturonSeguridad: true,
        pitoReversa: true,
        pito: true,
        frenoEmergencia: true,
        Espejos: true,
        espejosLaterales: true,
        EstadoCarcasaLuces: true,
        limpiaparabrisas: true,
        tapizado: true,
        panoramico: true,
      },
    ],
  };

  before(async () => {
    await connectTestDB();
  });

  after(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();

    expect(fs.existsSync(licenciaPath), `No existe: ${licenciaPath}`).to.equal(true);

    const prop = await request(app)
      .post("/api/propietario-post")
      .send(propietarioPayload);

    expect([200, 201]).to.include(prop.status);
    propietarioId = prop.body.data._id;

    const cond = await request(app)
      .post("/api/conductor-post")
      .field("nombre", "Maria")
      .field("apellido", "Lopez")
      .field("tipoDocumento", "Cedula de ciudadania")
      .field("numDoc", "987654321")
      .field("numTel", "3102223344")
      .attach("licencia", licenciaPath);

    expect([200, 201]).to.include(cond.status);
    conductorId = cond.body.data._id;

    const veh = await request(app)
      .post("/api/vehiculo-post")
      .send({
        tipoVehiculo: "Carro",
        placa: "ABC123",
        modelo: "2018",
        fechaSoat: "2025-02-01",
        fechaTecno: "2025-03-01",
        propietarioId,
        conductorId,
      });

    expect([200, 201]).to.include(veh.status);
    vehiculoId = veh.body.data._id;
  });

  it("POST /api/estado-post -> con Observacion (texto) retorna estadoVehiculo='Mal estado'", async () => {
    const res = await request(app)
      .post("/api/estado-post")
      .send({
        ...baseEstadoPayload,
        Observacion: "Aceite de motor bajo",
        vehiculoId,
      });

    if (res.status !== 201) console.log("ESTADO POST:", res.status, res.body);

    expect(res.status).to.equal(201);
    expect(res.body.success).to.equal(true);
    expect(res.body.estadoVehiculo).to.equal("Mal estado");
    expect(res.body.data).to.have.property("_id");
  });

  it("POST /api/estado-post -> con Observacion vacía retorna estadoVehiculo='Buen estado'", async () => {
    const res = await request(app)
      .post("/api/estado-post")
      .send({
        ...baseEstadoPayload,
        Observacion: "",
        vehiculoId,
      });

    expect(res.status).to.equal(201);
    expect(res.body.success).to.equal(true);
    expect(res.body.estadoVehiculo).to.equal("Buen estado");
  });

  it("POST /api/estado-post -> si no manda vehiculoId debe devolver 400", async () => {
    const res = await request(app)
      .post("/api/estado-post")
      .send({
        ...baseEstadoPayload,
        Observacion: "Aceite de motor bajo",
      });

    expect(res.status).to.equal(400);
    expect(res.body.success).to.equal(false);
  });

  it("POST /api/estado-post -> si vehiculoId no existe debe devolver 404", async () => {
    const res = await request(app)
      .post("/api/estado-post")
      .send({
        ...baseEstadoPayload,
        Observacion: "Aceite de motor bajo",
        vehiculoId: "000000000000000000000000",
      });

    expect(res.status).to.equal(404);
    expect(res.body.success).to.equal(false);
  });
});
