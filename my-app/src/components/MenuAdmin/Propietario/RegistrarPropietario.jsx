import { Link, useNavigate } from "react-router-dom";
import { clearAuth } from "../../../utils/auth";
import logo from "../../../assets/img/logo/LogoSinFondo.png";
import propietatio from "../../../assets/img/Admin/propietario.png";
import { useState } from "react";

function RegistrarPropietario() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    tipoDoc: "",
    numDoc: "",
    numTel: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const cerrarSesion = () => {
    clearAuth();
    return navigate("/");
  };

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

    const { nombre, apellido, tipoDoc, numDoc, numTel } = formData;

    if (!nombre || !apellido || !tipoDoc || !numDoc || !numTel) {
      setErrorMsg("Por favor completa todos los campos.");
      return;
    }

    try {
      setLoading(true);

      const body = {
        nombre,
        apellido,
        tipoDoc,
        numDoc,   
        numTel,
      };

      const resp = await fetch("https://gestion-de-inspecciones-vehiculares.onrender.com/api/propietario-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok || !data.success) {
        throw new Error(data.message || "No se pudo registrar el propietario.");
      }

      setSuccessMsg("Propietario registrado correctamente.");

      setTimeout(() => {
        navigate("/propietario-admin");
      }, 1000);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || "Error al registrar el propietario.");
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
              <Link to="/propietario-admin">Regresar</Link>
            </li>
            <li>
              <button onClick={cerrarSesion}>Cerrar Sesión</button>
            </li>
          </ul>
        </div>
      </div>

      <div className="contentAdmin2">
        <div className="registerUser">
          <img src={propietatio} className="img1" alt="Propietario" />
          <form onSubmit={handleSubmit}>
            <div className="contenedorFormulario">
              <div className="input1">
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Ingrese el nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                />

                <label>Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  placeholder="Ingrese el apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                />

                <label>Tipo de documento</label>
                <select
                  name="tipoDoc"
                  value={formData.tipoDoc}
                  onChange={handleChange}
                >
                  <option value="">-Seleccione una opción-</option>
                  <option value="Cedula de ciudadania">
                    Cédula de ciudadanía
                  </option>
                  <option value="Cedula de extranjería">
                    Cédula de extranjería
                  </option>
                  <option value="Pasaporte">Pasaporte</option>
                </select>
              </div>

              <div className="input1">
                <label>Número de documento</label>
                <input
                  type="text"
                  name="numDoc"
                  placeholder="Ingrese el número de documento"
                  value={formData.numDoc}
                  onChange={handleChange}
                />

                <label>Teléfono</label>
                <input
                  type="text"
                  name="numTel"
                  placeholder="Ingrese el número de teléfono"
                  value={formData.numTel}
                  onChange={handleChange}
                />
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

export default RegistrarPropietario;
