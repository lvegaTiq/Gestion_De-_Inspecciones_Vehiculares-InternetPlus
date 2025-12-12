import { Link, useNavigate, useParams } from "react-router-dom";
import { clearAuth } from "../../../utils/auth";
import logo from "../../../assets/img/logo/LogoSinFondo.png";
import user from "../../../assets/img/Admin/usuario.png";
import { useEffect, useState } from "react";

function ActualizarUsuario() {
  const navigate = useNavigate();
  const { id } = useParams(); 

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
    estado: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const cerrarSesion = () => {
    clearAuth();
    return navigate("/");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoadingUser(true);
        const resp = await fetch(`http://localhost:3000/api/users-get`);
        if (!resp.ok) {
          throw new Error("No se pudo obtener la información del usuario.");
        }
      
        const result = await resp.json();
        const data = result?.data?.docs || result;
      
        const u = data.find((user) => user._id === id);
      
        if (!u) {
          throw new Error("Usuario no encontrado.");
        }
      
        setFormData({
          nombre: u.nombre || "",
          apellido: u.apellido || "",
          tipoDocumento: u.tipoDocumento || "",
          documento: u.documento || "",
          email: u.email || "",
          telefono: u.telefono || "",
          password: "",
          confirmarPassword: "",
          role: u.role || "",
          estado: u.estado || "",
        });
      } catch (error) {
        console.error(error);
        setErrorMsg(
          error.message || "Error al cargar la información del usuario."
        );
      } finally {
        setLoadingUser(false);
      }
    };
  
    if (id) {
      fetchUser();
    }
  }, [id]);


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
      !formData.role
    ) {
      setErrorMsg("Por favor completa los campos obligatorios.");
      return;
    }

    if (
      (formData.password || formData.confirmarPassword) &&
      formData.password !== formData.confirmarPassword
    ) {
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
        role: formData.role,
        estado: formData.estado,
      };

      if (formData.password) {
        body.password = formData.password;
      }

      const resp = await fetch(`http://localhost:3000/api/users-update/${id}`,{
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al actualizar el usuario");
      }

      setSuccessMsg("Usuario actualizado correctamente.");
      setTimeout(() => {
        navigate("/menu-admin");
      }, 1000);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || "Error al actualizar el usuario.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="contentAdmin">
        <div className="navAdmin">
          <img src={logo} alt="Logo InternetPlus" />
        </div>
        <div className="contentAdmin2">
          <p>Cargando datos del usuario...</p>
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

                <label>Contraseña (dejar en blanco si no desea cambiarla)</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Nueva contraseña"
                  value={formData.password}
                  onChange={handleChange}
                />

                <label>Confirmar contraseña</label>
                <input
                  type="password"
                  name="confirmarPassword"
                  placeholder="Confirme la nueva contraseña"
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

                <label>Estado</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                >
                  <option value="">-Seleccione una opción-</option>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
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
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ActualizarUsuario;
