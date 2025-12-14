import { Link, useNavigate } from "react-router-dom";
import { clearAuth } from "../../../utils/auth";
import logo from "../../../assets/img/logo/LogoSinFondo.png";
import { useEffect, useState } from "react";

function ConductorAdmin() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [conductorSeleccionado, setConductorSeleccionado] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState("");

  const navigate = useNavigate();
  const cerrarSesion = () => {
    clearAuth();
    return navigate("/");
  };

  const registrarConductor = () => {
    navigate("/registrar-conductor");
  };

  useEffect(() => {
    const dataConductor = async () => {
      try {
        const response = await fetch(
          "https://gestion-de-inspecciones-vehiculares.onrender.com/api/conductor-get"
        );
        if (!response.ok) {
          throw new Error("Error al consultar los datos");
        }
        const result = await response.json();
        const data = result.data.docs;
        setData(data);
      } catch (error) {
        console.error("Error al momento de consultar los datos: ", error);
      }
    };
    dataConductor();
  }, []);

  const conductorFiltrado = data.filter((item) => {
    const text = search.toLowerCase();
    return (
      item._id.toLowerCase().includes(text) ||
      String(item.numDoc || "").toLowerCase().includes(text) ||
      (item.estado || "").toLowerCase().includes(text)
    );
  });

  const ejecutarCambioEstado = async () => {
    if (!conductorSeleccionado) return;

    try {
      const response = await fetch(
        `https://gestion-de-inspecciones-vehiculares.onrender.com/api/conductor-inactivar/${conductorSeleccionado._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            estado: nuevoEstado,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error backend:", response.status, errorData);
        throw new Error(errorData.message || "Error al cambiar el estado");
      }

      const result = await response.json();
      const estadoFinal = result.data?.estado || nuevoEstado;

      setData((prev) =>
        prev.map((u) =>
          u._id === conductorSeleccionado._id
            ? { ...u, estado: estadoFinal }
            : u
        )
      );

      setShowModal(false);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || "Error al cambiar el estado");
    }
  };

  return (
    <div className="contentAdmin">
      <div className="navAdmin">
        <img src={logo} alt="Logo InternetPlus" />
        <div className="navbar">
          <ul className="menu">
            <li>
              <Link to="/menu-admin">Usuarios</Link>
            </li>
            <li>
              <Link
                to="/conductor-admin"
                style={{ textDecoration: "underline" }}
              >
                Conductor
              </Link>
            </li>
            <li>
              <Link to="/vehiculo-admin">Vehiculo</Link>
            </li>
            <li>
              <Link to="/propietario-admin">Popietario</Link>
            </li>
            <li>
              <button onClick={cerrarSesion}>Cerrar Sesión</button>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <div className="tablausers">
          <div className="barrabusqueda">
            <div className="textBarraBusqueda">
              <h4>Conductores</h4>
            </div>
            <input
              type="text"
              placeholder="🔍 Buscar conductor por ID, número de documento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={registrarConductor}>Registrar</button>
          </div>
          <div className="tablausersData">
            <table>
              <thead>
                <tr>
                  <th>Nombres</th>
                  <th>Apellido</th>
                  <th>Tipo de documento</th>
                  <th>Número de documento</th>
                  <th>Numero de teléfono</th>
                  <th>Licencia</th>
                  <th>Estado</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {conductorFiltrado.length > 0 ? (
                  conductorFiltrado.map((item) => (
                    <tr key={item._id}>
                      <td>{item.nombre}</td>
                      <td>{item.apellido}</td>
                      <td>{item.tipoDocumento}</td>
                      <td>{item.numDoc}</td>
                      <td>{item.numTel}</td>
                      <td>
                        <img
                          src={`https://gestion-de-inspecciones-vehiculares.onrender.com${item.licencia}`}
                          style={{ width: "80px", height: "auto" }}
                          alt="Licencia"
                        />
                      </td>
                      <td>{item.estado}</td>
                      <td className="options">
                        <Link
                          to={`/actualizar-conductor/${item._id}`}
                          className="actualizar"
                        >
                          Actualizar
                        </Link>
                        <button
                          className="inactivar"
                          type="button"
                          onClick={() => {
                            const estadoNuevo =
                              item.estado === "Activo"
                                ? "Inactivo"
                                : "Activo";
                            setConductorSeleccionado(item);
                            setNuevoEstado(estadoNuevo);
                            setShowModal(true);
                          }}
                        >
                          {item.estado === "Activo"
                            ? "Inactivar"
                            : "Activar"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8}>No hay datos disponibles.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {errorMsg && (
              <p style={{ color: "red", marginTop: "0.5rem" }}>{errorMsg}</p>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Cambiar estado del conductor</h3>
            <p>
              ¿Seguro que deseas cambiar el estado de
              <strong>
                {" "}
                {conductorSeleccionado?.nombre}{" "}
                {conductorSeleccionado?.apellido}{" "}
              </strong>
              a <strong>{nuevoEstado}</strong>?
            </p>

            <div className="modal-buttons">
              <button className="btn-confirm" onClick={ejecutarCambioEstado}>
                Confirmar
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConductorAdmin;
