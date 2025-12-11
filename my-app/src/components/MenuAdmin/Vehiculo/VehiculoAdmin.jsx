import { Link, useNavigate } from 'react-router-dom';
import { clearAuth } from '../../../utils/auth';
import logo from '../../../assets/img/logo/LogoSinFondo.png'
import { useEffect, useState } from 'react';

function VehiculoAdmin() {
  const [vehiculo, setVehiculo] = useState([]);
  const [search, setSearch] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState("");

  const navigate = useNavigate();

  const cerrarSesion = () => {
    clearAuth();
    return navigate('/');
  };

  const registervehiculo = () => {
    navigate('/registrar-vehiculo');
  };

  useEffect(() => {
    const fetchVehiculo = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/vehiculo-get');

        if (!response.ok) {
          throw new Error('Error al momento de consultar los datos');
        }

        const result = await response.json();
        const docs = result.data.docs || [];

        setVehiculo(docs);
      } catch (error) {
        console.log('Error al momento de consultar los datos de la api: ', error);
      }
    };
    fetchVehiculo();
  }, []);

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    return new Date(fecha).toLocaleDateString("es-CO");
  };

  const vehiculosFiltrados = vehiculo.filter((item) => {
    const text = search.toLowerCase();

    const propietario = item.propietario
      ? `${item.propietario.nombre} ${item.propietario.apellido}`.toLowerCase()
      : "";

    const conductor = item.conductor
      ? `${item.conductor.nombre} ${item.conductor.apellido}`.toLowerCase()
      : "";

    return (
      item.placa.toLowerCase().includes(text) ||
      item.tipoVehiculo.toLowerCase().includes(text) ||
      item.modelo.toLowerCase().includes(text) ||
      propietario.includes(text) ||
      conductor.includes(text)
    );
  });

  const ejecutarCambioEstado = async () => {
    if (!vehiculoSeleccionado) return;

    try {
      const resp = await fetch(
        `http://localhost:3000/api/vehiculo-inactivar/${vehiculoSeleccionado._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estadoVehiculo: nuevoEstado }),
        }
      );

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al cambiar estado");
      }

      const result = await resp.json();
      const estadoFinal = result.data?.estadoVehiculo || nuevoEstado;

      setVehiculo((prev) =>
        prev.map((v) =>
          v._id === vehiculoSeleccionado._id
            ? { ...v, estadoVehiculo: estadoFinal }
            : v
        )
      );

      setShowModal(false);
      setErrorMsg("");
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || "Error al cambiar el estado.");
    }
  };

  return (
    <div className="contentAdmin">
      <div className="navAdmin">
        <img src={logo} alt='Logo InternetPlus' />
        <div className="navbar">
          <ul className='menu'>
            <li><Link to='/menu-admin'>Usuarios</Link></li>
            <li><Link to='/conductor-admin'>Conductor</Link></li>
            <li><Link to='/vehiculo-admin' style={{ textDecoration: 'underline' }}>Vehiculo</Link></li>
            <li><Link to='/propietario-admin'>Popietario</Link></li>
            <li><button onClick={cerrarSesion}>Cerrar Sesión</button></li>
          </ul>
        </div>
      </div>

      <div className="">
        <div className="tablausers">
          <div className="barrabusqueda">
            <div className="textBarraBusqueda">
              <h4>Vehiculos</h4>
            </div>
            <input
              type="text"
              placeholder="Buscar por placa, tipo, propietario, conductor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={registervehiculo}>Registrar</button>
          </div>
          <div className="tablausersData">
            <table>
              <thead>
                <tr>
                  <th>Tipo vehículo</th>
                  <th>Placa</th>
                  <th>Modelo</th>
                  <th>Fecha SOAT</th>
                  <th>Fecha técno-mecánica</th>
                  <th>Propietario</th>
                  <th>Conductor</th>
                  <th>Estado mecánico</th>
                  <th>Estado del vehículo</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {vehiculosFiltrados.length > 0 ? (
                  vehiculosFiltrados.map((item) => (
                    <tr key={item._id}>
                      <td>{item.tipoVehiculo}</td>
                      <td>{item.placa}</td>
                      <td>{item.modelo}</td>
                      <td>{formatearFecha(item.fechaSoat)}</td>
                      <td>{formatearFecha(item.fechaTecno)}</td>
                      <td>
                        {item.propietario
                          ? `${item.propietario.nombre} ${item.propietario.apellido}`
                          : "Sin propietario"}
                      </td>
                      <td>
                        {item.conductor
                          ? `${item.conductor.nombre} ${item.conductor.apellido}`
                          : "Sin conductor"}
                      </td>
                      <td>{item.estado}</td>
                      <td>{item.estadoVehiculo}</td>
                      <td className="options">
                        <Link
                          to={`/actualizar-vehiculo/${item._id}`}
                          className='actualizar'
                        >
                          Actualizar
                        </Link>

                        {/* Botón activar / inactivar usando estadoVehiculo */}
                        <button
                          className='inactivar'
                          type="button"
                          onClick={() => {
                            const estadoNuevo =
                              item.estadoVehiculo === "Activo"
                                ? "Inactivo"
                                : "Activo";
                            setVehiculoSeleccionado(item);
                            setNuevoEstado(estadoNuevo);
                            setShowModal(true);
                          }}
                        >
                          {item.estadoVehiculo === "Activo"
                            ? "Inactivar"
                            : "Activar"}
                        </button>

                        <button
                          className="actualizar"
                          onClick={() =>
                            window.open(
                              `http://localhost:3000/api/generar-reporte/${item._id}`,
                              "_blank"
                            )
                          }
                        >
                          Generar reporte
                        </button>

                        {errorMsg && (
                          <p style={{ color: "red", margin: "0.5rem 0" }}>{errorMsg}</p>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10}>No hay datos disponibles</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Cambiar estado del vehículo</h3>
            <p>
              ¿Seguro que deseas cambiar el estado del vehículo con placa{" "}
              <strong>{vehiculoSeleccionado?.placa}</strong> a{" "}
              <strong>{nuevoEstado}</strong>?
            </p>

            <div className="modal-buttons">
              <button className="btn-confirm" onClick={ejecutarCambioEstado}>
                Confirmar
              </button>
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default VehiculoAdmin;
