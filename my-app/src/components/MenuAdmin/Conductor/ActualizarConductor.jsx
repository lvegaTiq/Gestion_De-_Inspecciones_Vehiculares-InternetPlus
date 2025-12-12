import { Link, useNavigate, useParams } from "react-router-dom";
import { clearAuth } from "../../../utils/auth";
import logo from "../../../assets/img/logo/LogoSinFondo.png";
import conductor from "../../../assets/img/Admin/conductor.png";
import { useRef, useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";

function ActualizarConductor() {
  const navigate = useNavigate();
  const { id } = useParams(); 

  const cerrarSesion = () => {
    clearAuth();
    return navigate("/");
  };

  const inputRef = useRef();
  const [selectFile, setSelectFile] = useState(null);
  const [licenciaActual, setLicenciaActual] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    tipoDocumento: "",
    numDoc: "",
    numTel: "",
    estado: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingConductor, setLoadingConductor] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchConductor = async () => {
      try {
        setLoadingConductor(true);
        const resp = await fetch("http://localhost:3000/api/conductor-get");

        if (!resp.ok) {
          throw new Error("No se pudo obtener la información del conductor.");
        }

        const result = await resp.json();
        const data = result?.data?.docs || [];

        const c = data.find((item) => item._id === id);
        if (!c) {
          throw new Error("Conductor no encontrado.");
        }

        setFormData({
          nombre: c.nombre || "",
          apellido: c.apellido || "",
          tipoDocumento: c.tipoDocumento || "",
          numDoc: c.numDoc || "",
          numTel: c.numTel || "",
          estado: c.estado || "",
        });

        setLicenciaActual(c.licencia || "");
      } catch (error) {
        console.error(error);
        setErrorMsg(
          error.message || "Error al cargar la información del conductor."
        );
      } finally {
        setLoadingConductor(false);
      }
    };

    if (id) {
      fetchConductor();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnchange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      if (!file.type.startsWith("image/")) {
        alert("Solo se permiten imágenes");
        return;
      }

      setSelectFile(file);
    }
  };

  const onChangeFile = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const removeFile = (e) => {
    e.preventDefault();
    setSelectFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (
      !formData.nombre ||
      !formData.apellido ||
      !formData.tipoDocumento ||
      !formData.numDoc ||
      !formData.numTel
    ) {
      setErrorMsg("Por favor completa los campos obligatorios.");
      return;
    }

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("nombre", formData.nombre);
      fd.append("apellido", formData.apellido);
      fd.append("tipoDocumento", formData.tipoDocumento);
      fd.append("numDoc", formData.numDoc);
      fd.append("numTel", formData.numTel);
      fd.append("email", formData.email);
      fd.append("estado", formData.estado || "");

      if (selectFile) {
        fd.append("licencia", selectFile);
      }

      const resp = await fetch(`http://localhost:3000/api/conductor-put/${id}`,{
          method: "PUT",
          body: fd,
        }
      );

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Error al actualizar el conductor"
        );
      }

      const result = await resp.json();
      setSuccessMsg("Conductor actualizado correctamente.");

      if (result.data?.licencia) {
        setLicenciaActual(result.data.licencia);
        setSelectFile(null);
        if (inputRef.current) inputRef.current.value = "";
      }

      setTimeout(() => {
        navigate("/conductor-admin");
      }, 1000);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || "Error al actualizar el conductor.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingConductor) {
    return (
      <div className="contentAdmin">
        <div className="navAdmin">
          <img src={logo} alt="Logo InternetPlus" />
        </div>
        <div className="contentAdmin2">
          <p>Cargando datos del conductor...</p>
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
              <Link to="/conductor-admin">Regresar</Link>
            </li>
            <li>
              <button onClick={cerrarSesion}>Cerrar Sesión</button>
            </li>
          </ul>
        </div>
      </div>

      <div className="contentAdmin2">
        <div className="registerUser">
          <img src={conductor} className="img1" alt="Conductor" />

          <form onSubmit={handleSubmit}>
            <div className="contenedorFormulario">
              <div className="input1">
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Ingrese el nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                />

                <label>Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  placeholder="Ingrese el apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                />

                <label>Tipo de documento</label>
                <select
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={handleInputChange}
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
                  name="numDoc"
                  placeholder="Ingrese el número de documento"
                  value={formData.numDoc}
                  onChange={handleInputChange}
                />
              </div>

              <div className="input1">
               
                <label>Teléfono</label>
                <input
                  type="text"
                  name="numTel"
                  placeholder="Ingrese el número de teléfono"
                  value={formData.numTel}
                  onChange={handleInputChange}
                />

                <label>Estado</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                >
                  <option value="">-Seleccione una opción-</option>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>

                <label>Licencia</label>
                <input
                  type="file"
                  ref={inputRef}
                  style={{ display: "none" }}
                  onChange={handleOnchange}
                  accept="image/*"
                />

                {!selectFile ? (
                  <>
                    {licenciaActual && (
                      <div className="preview-container">
                        <img
                          src={`http://localhost:3000${licenciaActual}`}
                          alt="Licencia actual"
                          className="preview-img"
                        />
                      </div>
                    )}
                    <button
                      type="button"
                      className="file-btn"
                      onClick={onChangeFile}
                    >
                      Cambiar imagen
                    </button>
                  </>
                ) : (
                  <div className="preview-container">
                    <img
                      src={URL.createObjectURL(selectFile)}
                      alt="Licencia nueva"
                      className="preview-img"
                    />
                  </div>
                )}

                {selectFile && (
                  <div className="select-file">
                    <p><strong>Archivo:</strong> {selectFile.name}</p>
                    <button onClick={removeFile} type="button">
                      <MdDelete />
                    </button>
                  </div>
                )}
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

export default ActualizarConductor;
