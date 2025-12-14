import { Link, useNavigate, useParams } from "react-router-dom";
import { clearAuth } from "../../../utils/auth";
import logo from "../../../assets/img/logo/LogoSinFondo.png";
import propietarioImg from "../../../assets/img/Admin/propietario.png";
import { useEffect, useState } from "react";

function ActualizarPropietario() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    tipoDoc: "",
    numDoc: "",
    numTel: "",
    estado: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingProp, setLoadingProp] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const cerrarSesion = () => {
    clearAuth();
    return navigate("/");
  };

  useEffect(() => {
    const fetchPropietario = async () => {
      try {
        setLoadingProp(true);
        const resp = await fetch("https://gestion-de-inspecciones-vehiculares.onrender.com/api/propietario-get");
        if (!resp.ok) {
          throw new Error("No se pudo obtener la información del propietario.");
        }

        const result = await resp.json();
        const data = result?.data?.docs || [];

        const p = data.find((item) => item._id === id);
        if (!p) {
          throw new Error("Propietario no encontrado.");
        }

        setFormData({
          nombre: p.nombre || "",
          apellido: p.apellido || "",
          tipoDoc: p.tipoDoc || "",
          numDoc: p.numDoc || "",
          numTel: p.numTel || "",
          estado: p.estado || "Activo",
        });
      } catch (error) {
        console.error(error);
        setErrorMsg(error.message || "Error al cargar el propietario.");
      } finally {
        setLoadingProp(false);
      }
    };

    if (id) {
      fetchPropietario();
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
      !formData.tipoDoc ||
      !formData.numDoc ||
      !formData.numTel
    ) {
      setErrorMsg("Por favor completa todos los campos obligatorios.");
      return;
    }

    try {
      setLoading(true);

      const body = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        tipoDoc: formData.tipoDoc,
        numDoc: formData.numDoc,
        numTel: formData.numTel,
        estado: formData.estado || "Activo",
      };

      const resp = await fetch(
        `https://gestion-de-inspecciones-vehiculares.onrender.com/api/propietario-put/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Error al actualizar el propietario."
        );
      }

      setSuccessMsg("Propietario actualizado correctamente.");
      setTimeout(() => {
        navigate("/propietario-admin");
      }, 1000);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || "Error al actualizar el propietario.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingProp) {
    return (
      <div className="contentAdmin">
        <div className="navAdmin">
          <img src={logo} alt="Logo InternetPlus" />
        </div>
        <div className="contentAdmin2">
          <p>Cargando datos del propietario...</p>
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
          <img src={propietarioImg} className="img1" alt="Propietario" />

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

            <button className="buttonregister" type="submit" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ActualizarPropietario;
