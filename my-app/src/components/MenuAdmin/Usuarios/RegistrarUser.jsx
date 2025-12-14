import { Link, useNavigate } from "react-router-dom";
import { clearAuth } from "../../../utils/auth";
import logo from '../../../assets/img/logo/LogoSinFondo.png';
import user from '../../../assets/img/Admin/usuario.png';
import { useState } from "react";

function RegistrarUsuario() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    tipoDocumento: "",
    documento: "",
    email: "",
    telefono: "",
    password: "",
    confirmarPassword: "",
    role: "",
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

    if (
      !formData.nombre ||
      !formData.apellido ||
      !formData.tipoDocumento ||
      !formData.documento ||
      !formData.email ||
      !formData.telefono ||
      !formData.password ||
      !formData.role
    ) {
      setErrorMsg("Por favor completa todos los campos obligatorios.");
      return;
    }

    if (formData.password !== formData.confirmarPassword) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);

      const body = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        tipoDocumento: formData.tipoDocumento,
        documento: formData.documento,
        email: formData.email,
        telefono: formData.telefono,
        password: formData.password,
        role: formData.role,
      };

      const resp = await fetch("https://gestion-de-inspecciones-vehiculares.onrender.com/api/users-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al registrar el usuario");
      }

      setSuccessMsg("Usuario registrado correctamente.");
      setFormData({
        nombre: "",
        apellido: "",
        tipoDocumento: "",
        documento: "",
        email: "",
        telefono: "",
        password: "",
        confirmarPassword: "",
        role: "",
      });

      setTimeout(() => {
        navigate("/menu-admin");
      }, 1000);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || "Error al registrar el usuario.");
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
              <Link to="/menu-admin">Regresar</Link>
            </li>
            <li>
              <button onClick={cerrarSesion}>Cerrar Sesión</button>
            </li>
          </ul>
        </div>
      </div>

      <div className="contentAdmin2">
        <div className="registerUser">
          <img src={user} className="img1" alt="Usuario" />

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
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
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

                <label>Número de documento</label>
                <input
                  type="text"
                  name="documento"
                  placeholder="Ingrese el número de documento"
                  value={formData.documento}
                  onChange={handleChange}
                />

                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Ingrese el Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="input1">
                <label>Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  placeholder="Ingrese el número de teléfono"
                  value={formData.telefono}
                  onChange={handleChange}
                />

                <label>Contraseña</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Ingrese la contraseña"
                  value={formData.password}
                  onChange={handleChange}
                />

                <label>Confirmar contraseña</label>
                <input
                  type="password"
                  name="confirmarPassword"
                  placeholder="Confirme la contraseña"
                  value={formData.confirmarPassword}
                  onChange={handleChange}
                />

                <label>Rol de usuario</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="">-Seleccione una opción-</option>
                  <option value="Admin">Administrador</option>
                  <option value="Supervisor">Supervisor</option>
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

            <button className="buttonregister" type="submit" disabled={loading}>
              {loading ? "Registrando..." : "Registrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegistrarUsuario;
