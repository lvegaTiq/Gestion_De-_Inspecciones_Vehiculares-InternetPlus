import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/img/logo/LogoSinFondo.png";
import { clearAuth } from "../../utils/auth";
import { useEffect, useState } from "react";

function ControlDeEstado() {
  const [vehiculos, setVehiculos] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const cerrarSesion = () => {
    clearAuth();
    return navigate("/");
  };

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const response = await fetch("https://gestion-de-inspecciones-vehiculares.onrender.com/api/vehiculo-get",{
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al consultar los vehículos");
        }

        const result = await response.json();
        const docs = result.data?.docs || [];
        setVehiculos(docs);
      } catch (error) {
        console.error(error);
      }
    };

    fetchVehiculos();
  }, []);

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    return new Date(fecha).toLocaleDateString("es-CO");
  };

    const vehiculosFiltrados = vehiculos.filter((item) => {
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

  return (
    <div className="contentAdmin">
      <div className="navAdmin">
        <img src={logo} alt="Logo InternetPlus" />
        <div className="navbar">
          <ul className="menu">
            <li>
              <button onClick={cerrarSesion}>Cerrar Sesión</button>
            </li>
          </ul>
        </div>
      </div>

      <div className="contentSupervisor2">
        <div className="tableVehiculo1">
          <div className="barrabusqueda1">
            <div className="textBarraBusqueda">
              <h4>Vehículos</h4>
            </div>
            <input
              type="text"
              placeholder="Buscar por placa, tipo, propietario, conductor..."
              value={search}
              onChange={(e)=> setSearch(e.target.value)}
            />
          </div>

          <div className="tablausersData">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo de vehículo</th>
                  <th>Placa</th>
                  <th>Modelo</th>
                  <th>Fecha del Soat</th>
                  <th>Fecha Tecnomecánica</th>
                  <th>Propietario</th>
                  <th>Conductor</th>
                  <th>Estado mecánico</th>
                  <th>Estado del vehículo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {vehiculosFiltrados.length > 0 ? (
                  vehiculosFiltrados.map((item) => (
                    <tr key={item._id}>
                      <td>{item._id}</td>
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
                        <Link className="actualizar" to={`/registro-estado/${item._id}`}>Registrar</Link>
                        <button
                          className="actualizar"
                          onClick={() =>
                            window.open(
                              `https://gestion-de-inspecciones-vehiculares.onrender.com/api/generar-reporte/${item._id}`,
                              "_blank"
                            )
                          }
                        >
                          Generar reporte
                        </button>
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
    </div>
  );
}

export default ControlDeEstado;
