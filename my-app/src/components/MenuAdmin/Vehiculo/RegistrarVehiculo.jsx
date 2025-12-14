import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/img/logo/LogoSinFondo.png";
import { clearAuth } from "../../../utils/auth";
import vehiculo from "../../../assets/img/Admin/VehiculoA.png";
import { useEffect, useState } from "react";

function RegistrarVehiculo() {
  const navigate = useNavigate();
  const cerrarSesion = () => {
    clearAuth();
    return navigate("/");
  };

  const [formData, setFormData] = useState({
    tipoVehiculo: "",
    placa: "",
    modelo: "",
    fechaSoat: "",
    fechaTecno: "",
    propietarioId: "",
    conductorId: "",
  });

  const [propietarios, setPropietarios] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [respProp, respCond] = await Promise.all([
          fetch("https://gestion-de-inspecciones-vehiculares.onrender.com/api/propietario-get"),
          fetch("https://gestion-de-inspecciones-vehiculares.onrender.com/api/conductor-get"),
        ]);

        if (!respProp.ok || !respCond.ok) {
          throw new Error("Error al cargar propietarios o conductores");
        }

        const resultProp = await respProp.json();
        const resultCond = await respCond.json();

        setPropietarios(resultProp.data?.docs || []);
        setConductores(resultCond.data?.docs || []);
      } catch (error) {
        console.error(error);
        setErrorMsg(
          error.message || "Error al cargar propietarios y conductores"
        );
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const {
      tipoVehiculo,
      placa,
      modelo,
      fechaSoat,
      fechaTecno,
      propietarioId,
      conductorId,
    } = formData;

    console.log("FORM DATA SUBMIT:", formData);

    const requiredFields = [
      tipoVehiculo,
      placa,
      modelo,
      fechaSoat,
      fechaTecno,
      propietarioId,
      conductorId,
    ];

    const algunVacio = requiredFields.some(
      (v) => !String(v || "").trim()
    );

    if (algunVacio) {
      setErrorMsg("Por favor completa todos los campos.");
      return;
    }

    try {
      setLoading(true);

      const resp = await fetch("https://gestion-de-inspecciones-vehiculares.onrender.com/api/vehiculo-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipoVehiculo,
          placa,
          modelo,
          fechaSoat,
          fechaTecno,
          propietarioId,
          conductorId,
        }),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Error al registrar el vehículo"
        );
      }

      await resp.json();
      setSuccessMsg("Vehículo registrado correctamente.");

      setTimeout(() => {
        navigate("/vehiculo-admin");
      }, 1000);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || "Error al registrar el vehículo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contentAdmin">
      <div className="navAdmin">
        <img src={logo} alt="Logo InternetPlus" />
        <div className="navbar">
          <ul className="menu">
            <li>
              <Link to="/vehiculo-admin">Regresar</Link>
            </li>
            <li>
              <button onClick={cerrarSesion}>Cerrar Sesión</button>
            </li>
          </ul>
        </div>
      </div>

      <div className="contentAdmin2">
        <div className="registerUser">
          <img src={vehiculo} className="img1" alt="Vehículo" />
          <form onSubmit={handleSubmit}>
            <div className="contenedorFormulario">
              <div className="input1">
                <label>Tipo de vehículo</label>
                <select
                  name="tipoVehiculo"
                  value={formData.tipoVehiculo}
                  onChange={handleChange}
                >
                  <option value="">-Seleccione una opción-</option>
                  <option value="Carro">Carro</option>
                  <option value="Moto">Moto</option>
                </select>

                <label>Placa</label>
                <input
                  type="text"
                  name="placa"
                  placeholder="Ingrese la placa"
                  value={formData.placa}
                  onChange={handleChange}
                />

                <label>Modelo</label>
                <input
                  type="text"
                  name="modelo"
                  placeholder="Ingrese el modelo"
                  value={formData.modelo}
                  onChange={handleChange}
                />

                <label>Fecha de vencimiento SOAT</label>
                <input
                  type="date"
                  name="fechaSoat"
                  value={formData.fechaSoat}
                  onChange={handleChange}
                />

                
              </div>

              <div className="input1">
                <label>Fecha de vencimiento tecnomecánica</label>
                <input
                  type="date"
                  name="fechaTecno"
                  value={formData.fechaTecno}
                  onChange={handleChange}
                />
                <label>Propietario</label>
                <select
                  name="propietarioId"
                  value={formData.propietarioId}
                  onChange={handleChange}
                >
                  <option value="">-Seleccione un propietario-</option>
                  {propietarios.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.nombre} {p.apellido} - {p.numDoc}
                    </option>
                  ))}
                </select>

                <label>Conductor</label>
                <select
                  name="conductorId"
                  value={formData.conductorId}
                  onChange={handleChange}
                >
                  <option value="">-Seleccione un conductor-</option>
                  {conductores.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.nombre} {c.apellido} - {c.numDoc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {errorMsg && (
              <p style={{ color: "red", marginTop: "0.5rem" }}>{errorMsg}</p>
            )}
            {successMsg && (
              <p style={{ color: "green", marginTop: "0.5rem" }}>
                {successMsg}
              </p>
            )}

            <button
              className="buttonregister"
              type="submit"
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegistrarVehiculo;
