import { Link, useNavigate } from "react-router-dom";
import { clearAuth } from "../../../utils/auth";
import logo from "../../../assets/img/logo/LogoSinFondo.png";
import conductor from "../../../assets/img/Admin/conductor.png";
import { useRef, useState } from "react";
import { MdDelete } from "react-icons/md";

function RegistrarConductor() {
  const navigate = useNavigate();
  const cerrarSesion = () => {
    clearAuth();
    return navigate("/");
  };

  const inputRef = useRef();
  const [selectFile, setSelectFile] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    tipoDoc: "",
    numDoc: "",
    email: "",
    numTel: "",
    estado:"Activo"
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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
    const { nombre, apellido, tipoDoc, numDoc, numTel, email } = formData;

    if (!nombre || !apellido || !tipoDoc || !numDoc || !numTel) {
      setErrorMsg("Por favor completa todos los campos obligatorios.");
      return;
    }

    if (!selectFile) {
      setErrorMsg("Por favor sube la imagen de la licencia.");
      return;
    }

    try {
      setLoading(true);
    
      const fd = new FormData();
      fd.append("nombre", nombre);
      fd.append("apellido", apellido);

      fd.append("tipoDocumento", tipoDoc);

      fd.append("numDoc", numDoc);
      fd.append("numTel", numTel);

      if (email) fd.append("email", email);

      fd.append("licencia", selectFile);

      const resp = await fetch(
        "https://gestion-de-inspecciones-vehiculares.onrender.com/api/conductor-post",
        {
          method: "POST",
          body: fd,
        }
      );

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al registrar el conductor");
      }

      await resp.json();

      setSuccessMsg("Conductor registrado correctamente.");
      setTimeout(() => navigate("/conductor-admin"), 1000);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || "Error al registrar el conductor.");
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
                  name="tipoDoc"
                  value={formData.tipoDoc}
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
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Ingrese el Email"
                  value={formData.email}
                  onChange={handleInputChange}
                />

                <label>Teléfono</label>
                <input
                  type="text"
                  name="numTel"
                  placeholder="Ingrese el número de teléfono"
                  value={formData.numTel}
                  onChange={handleInputChange}
                />

                <label>Licencia</label>
                <input
                  type="file"
                  ref={inputRef}
                  style={{ display: "none" }}
                  onChange={handleOnchange}
                  accept="image/*"
                />

                {!selectFile ? (
                  <button
                    type="button"
                    className="file-btn"
                    onClick={onChangeFile}
                  >
                    Subir imagen
                  </button>
                ) : (
                  <div className="preview-container">
                    <img
                      src={URL.createObjectURL(selectFile)}
                      alt="Licencia"
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

            <button className="buttonregister" type="submit" disabled={loading}>
              {loading ? "Registrando..." : "Registrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegistrarConductor;