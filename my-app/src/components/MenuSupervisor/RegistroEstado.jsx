import { Link, useNavigate, useParams } from "react-router-dom";
import logo from "../../assets/img/logo/LogoSinFondo.png";
import { clearAuth } from "../../utils/auth";
import { useEffect, useState } from "react";

const CAMPOS_CHECKLIST_CARRO = {
  Nivel: [
    { key: "limpiavidrios", label: "Limpiavidrios" },
    { key: "AceiteMotor", label: "Aceite motor" },
    { key: "LiquidoFrenos", label: "Líquido de frenos" },
    { key: "LiquidoRefrigerante", label: "Líquido refrigerante" },
    { key: "NivelLiquidoHidraulico", label: "Nivel líquido hidráulico" },
  ],
  pedal: [
    { key: "frenos", label: "Frenos" },
    { key: "Acelerador", label: "Acelerador" },
    { key: "clutsh", label: "Clutch" },
  ],
  Luz: [
    { key: "Direccional", label: "Direccionales" },
    { key: "luces", label: "Luces principales" },
    { key: "lucesInternas", label: "Luces internas" },
    { key: "estacionarias", label: "Estacionarias" },
    { key: "stops", label: "Stops" },
    { key: "testigos", label: "Testigos tablero" },
    { key: "LuzReversa", label: "Luz reversa" },
  ],
  botiquin: [
    { key: "extintor", label: "Extintor" },
    { key: "fechaVencimiento", label: "Fecha vencimiento extintor" }, // 👈 este será input date
    { key: "llantaRepuesto", label: "Llanta de repuesto" },
    { key: "CrucetaAcordePernos", label: "Cruceta acorde a pernos" },
    { key: "Señales", label: "Señales" },
    { key: "tacos", label: "Tacos" },
    { key: "cajaHerramientas", label: "Caja de herramientas" },
    { key: "linterna", label: "Linterna" },
    { key: "gato", label: "Gato" },
    { key: "botiquinPrimerosAuxilios", label: "Botiquín primeros auxilios" },
  ],
  varios: [
    { key: "llantas", label: "Llantas" },
    { key: "bateria", label: "Batería" },
    { key: "rines", label: "Rines" },
    { key: "cinturonSeguridad", label: "Cinturones de seguridad" },
    { key: "pitoReversa", label: "Pito reversa" },
    { key: "pito", label: "Pito" },
    { key: "frenoEmergencia", label: "Freno de emergencia" },
    { key: "Espejos", label: "Espejo interior" },
    { key: "espejosLaterales", label: "Espejos laterales" },
    { key: "EstadoCarcasaLuces", label: "Carcasa luces" },
    { key: "limpiaparabrisas", label: "Limpiaparabrisas" },
    { key: "tapizado", label: "Tapizado" },
    { key: "panoramico", label: "Panorámico" },
  ],
};

const CAMPOS_CHECKLIST_MOTO = {
  Nivel: [
    { key: "AceiteMotor", label: "Aceite motor" },
    { key: "LiquidoFrenos", label: "Líquido de frenos" },
    { key: "LiquidoRefrigerante", label: "Líquido refrigerante" },
  ],
  pedal: [
    { key: "frenos", label: "Frenos" },
    { key: "Acelerador", label: "Acelerador" },
    { key: "clutsh", label: "Clutch" },
    { key: "barras", label: "Barras" },
    { key: "amortiguadores", label: "Amortiguadores" },
    { key: "Casco_visera", label: "Casco / visera" },
    { key: "sillin", label: "Sillín" },
    { key: "Posapies", label: "Posapiés" },
  ],
  Luz: [
    { key: "Direccional", label: "Direccionales" },
    { key: "luces", label: "Luces principales" },
    { key: "estacionarias", label: "Estacionarias" },
    { key: "stops", label: "Stops" },
    { key: "testigos", label: "Testigos tablero" },
  ],
  varios: [
    { key: "bateria", label: "Batería" },
    { key: "llantas", label: "Llantas" },
    { key: "rines", label: "Rines" },
    { key: "pito", label: "Pito" },
    { key: "espejosLaterales", label: "Espejos laterales" },
    { key: "EstadoCarcasaLuces", label: "Carcasa luces" },
  ],
};

function RegistroEstado() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [vehiculo, setVehiculo] = useState(null);
  const [tipoVehiculo, setTipoVehiculo] = useState("");
  const [fechaEstado, setFechaEstado] = useState("");
  const [kilometraje, setKilometraje] = useState("");
  const [observacion, setObservacion] = useState("");
  const [checklist, setChecklist] = useState({});
  const [loadingVehiculo, setLoadingVehiculo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const cerrarSesion = () => {
    clearAuth();
    return navigate("/");
  };

  useEffect(() => {
    const fetchVehiculo = async () => {
      try {
        setLoadingVehiculo(true);

        const resp = await fetch(
          "https://gestion-de-inspecciones-vehiculares.onrender.com/api/vehiculo-get"
        );

        if (!resp.ok) throw new Error("No se pudieron consultar los vehículos");

        const result = await resp.json();
        const docs = result.data?.docs || [];

        const v = docs.find((item) => item._id === id);
        if (!v) throw new Error("Vehículo no encontrado");

        setVehiculo(v);

        const tipo = (v.tipoVehiculo || v.tipo || "").toLowerCase();
        setTipoVehiculo(tipo);

        const config = tipo === "moto" ? CAMPOS_CHECKLIST_MOTO : CAMPOS_CHECKLIST_CARRO;

        // ✅ Inicializar checklist
        const initialChecklist = {};
        Object.entries(config).forEach(([grupo, campos]) => {
          initialChecklist[grupo] = {};
          campos.forEach((campo) => {
            // 👇 fechaVencimiento debe ser string, no boolean
            if (grupo === "botiquin" && campo.key === "fechaVencimiento") {
              initialChecklist[grupo][campo.key] = "";
            } else {
              initialChecklist[grupo][campo.key] = false;
            }
          });
        });

        setChecklist(initialChecklist);
      } catch (error) {
        console.error(error);
        setErrorMsg(error.message || "Error al cargar la información.");
      } finally {
        setLoadingVehiculo(false);
      }
    };

    if (id) fetchVehiculo();
  }, [id]);

  const handleCheckboxChange = (grupo, key) => {
    // 👇 Evitar togglear la fecha (es input date)
    if (grupo === "botiquin" && key === "fechaVencimiento") return;

    setChecklist((prev) => ({
      ...prev,
      [grupo]: {
        ...prev[grupo],
        [key]: !prev[grupo]?.[key],
      },
    }));
  };

  const handleFechaVencimientoChange = (value) => {
    setChecklist((prev) => ({
      ...prev,
      botiquin: {
        ...(prev.botiquin || {}),
        fechaVencimiento: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!fechaEstado || !kilometraje) {
      setErrorMsg("Por favor ingresa la fecha del estado y el kilometraje.");
      return;
    }

    if (!vehiculo) {
      setErrorMsg("No se encontró el vehículo.");
      return;
    }

    try {
      setLoading(true);

      const isMoto = tipoVehiculo === "moto";
      const config = isMoto ? CAMPOS_CHECKLIST_MOTO : CAMPOS_CHECKLIST_CARRO;

      // ✅ Payload EXACTO como tus CURL (mismos nombres)
      const payload = {
        FechaEstado: fechaEstado,
        kilometraje: Number(kilometraje),
        Observacion: observacion || "",
        vehiculoId: id,
      };

      // ✅ Grupos como array con 1 objeto
      Object.keys(config).forEach((grupo) => {
        payload[grupo] = [{ ...(checklist[grupo] || {}) }];
      });

      // ✅ Moto NO lleva botiquin
      if (isMoto) {
        delete payload.botiquin;
      } else {
        // ✅ Carro: garantizar que fechaVencimiento sea string (tipo "2025-10-10")
        if (!payload.botiquin?.[0]) payload.botiquin = [{}];
        payload.botiquin[0].fechaVencimiento = checklist?.botiquin?.fechaVencimiento || "";
      }

      const resp = await fetch(
        "https://gestion-de-inspecciones-vehiculares.onrender.com/api/estado-post",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok || data?.success === false) {
        throw new Error(data?.message || "No se pudo registrar el estado.");
      }

      setSuccessMsg("Estado del vehículo registrado correctamente.");

      setTimeout(() => {
        navigate("/menu-supervisor");
      }, 1000);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || "Error al registrar el estado.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingVehiculo) {
    return (
      <div className="contentAdmin">
        <div className="navAdmin">
          <img src={logo} alt="Logo InternetPlus" />
        </div>
        <div className="contentRegisterEstado">
          <p>Cargando datos del vehículo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="contentAdmin">
      <div className="navAdmin">
        <img src={logo} alt="Logo InternetPlus" />
        <div className="navbar">
          <ul className="menu">
            <li>
              <Link to="/menu-supervisor">Regresar</Link>
            </li>
            <li>
              <button onClick={cerrarSesion}>Cerrar Sesión</button>
            </li>
          </ul>
        </div>
      </div>

      <div className="contentRegisterEstado">
        <div className="contentFormEstado">
          <h1>Registrar estado del vehículo</h1>

          {vehiculo && (
            <p style={{ marginBottom: "1rem" }}>
              <strong>Placa:</strong> {vehiculo.placa} |{" "}
              <strong>Tipo:</strong> {vehiculo.tipoVehiculo}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <label>Fecha del estado</label>
            <input
              type="date"
              value={fechaEstado}
              onChange={(e) => setFechaEstado(e.target.value)}
            />

            <label>Kilometraje</label>
            <input
              type="number"
              value={kilometraje}
              onChange={(e) => setKilometraje(e.target.value)}
              placeholder="Ingrese el kilometraje"
            />

            <div className="checklists">
              {Object.entries(
                tipoVehiculo === "moto" ? CAMPOS_CHECKLIST_MOTO : CAMPOS_CHECKLIST_CARRO
              ).map(([grupo, campos]) => (
                <div className={grupo.toLowerCase()} key={grupo}>
                  <h3>{grupo}</h3>

                  <div className="grupo-checks">
                    {campos.map((campo) => {
                      // ✅ Para carro: fechaVencimiento es INPUT DATE, NO checkbox
                      if (
                        grupo === "botiquin" &&
                        campo.key === "fechaVencimiento" &&
                        tipoVehiculo !== "moto"
                      ) {
                        return (
                          <label key={campo.key} style={{ display: "block" }}>
                            {campo.label}
                            <input
                              type="date"
                              value={checklist?.botiquin?.fechaVencimiento || ""}
                              onChange={(e) => handleFechaVencimientoChange(e.target.value)}
                              style={{ display: "block", marginTop: "6px" }}
                            />
                          </label>
                        );
                      }

                      return (
                        <label key={campo.key} style={{ display: "block" }}>
                          <input
                            type="checkbox"
                            checked={!!checklist[grupo]?.[campo.key]}
                            onChange={() => handleCheckboxChange(grupo, campo.key)}
                          />{" "}
                          {campo.label}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <label>Observación</label>
            <textarea
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              placeholder="Observaciones del estado del vehículo"
              rows={3}
            />

            {errorMsg && (
              <p style={{ color: "red", marginTop: "0.5rem" }}>{errorMsg}</p>
            )}
            {successMsg && (
              <p style={{ color: "green", marginTop: "0.5rem" }}>
                {successMsg}
              </p>
            )}

            <button className="buttonregister" type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Registrar estado"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegistroEstado;
