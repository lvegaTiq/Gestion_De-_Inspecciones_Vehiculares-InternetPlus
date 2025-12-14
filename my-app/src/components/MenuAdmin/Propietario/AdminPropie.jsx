import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../assets/img/logo/LogoSinFondo.png'
import { clearAuth } from '../../../utils/auth';
import { useEffect, useState } from 'react';

function AdminPropietario() {
  const [search, setSearch] = useState("");
  const [propietario, setPropietario] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [propietarioSeleccionado, setPropietarioSeleccionado] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState("");

  const navigate = useNavigate();
  
  const cerrarSesion = () => {
    clearAuth();
    return navigate('/');
  };

  const propietarioRegister = () => {
    navigate('/registrar-propietario');
  };

  useEffect(() => {
    const fetchPropietario = async () => {
      try {
        const response = await fetch('https://gestion-de-inspecciones-vehiculares.onrender.com/api/propietario-get');
        if (!response.ok) {
          throw new Error('Error al consultar los datos');
        }

        const result = await response.json();
        const data = result?.data?.docs || [];
        setPropietario(data);
      } catch (error) {
        console.log('Error al momento de consultar los datos del propietario', error);
      }
    };
    fetchPropietario();
  }, []);

  const filtrarPropietario = propietario.filter((item) => {
    const text = search.toLowerCase();
    const numDocStr = String(item.numDoc || "").toLowerCase();
    const estadoStr = String(item.estado || "").toLowerCase();
    const idStr = String(item._id || "").toLowerCase();

    return (
      numDocStr.includes(text) ||
      estadoStr.includes(text) ||
      idStr.includes(text)
    );
  });

  const ejecutarCambioEstado = async () => {
    if (!propietarioSeleccionado) return;
    setErrorMsg("");

    try {
      const resp = await fetch(
        `https://gestion-de-inspecciones-vehiculares.onrender.com/api/propietario-patch/${propietarioSeleccionado._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado: nuevoEstado }),
        }
      );

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al cambiar estado");
      }

      const result = await resp.json();

      setPropietario((prev) =>
        prev.map((u) =>
          u._id === propietarioSeleccionado._id
            ? { ...u, estado: result.data?.estado || nuevoEstado }
            : u
        )
      );

      setShowModal(false);
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
            <li><Link to='/vehiculo-admin'>Vehiculo</Link></li>
            <li>
              <Link
                to='/propietario-admin'
                style={{ textDecoration: 'underline' }}
              >
                Popietario
              </Link>
            </li>
            <li><button onClick={cerrarSesion}>Cerrar Sesión</button></li>
          </ul>
        </div>
      </div>

      <div className="">
        <div className="tablausers">
          <div className="barrabusqueda">
            <div className="textBarraBusqueda">
              <h4>Propietarios</h4>
            </div>
            <input
              type="text"
              placeholder='🔍 Buscar por ID, número de documento o estado...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={propietarioRegister}>Registrar</button>
          </div>

          <div className="tablausersData">
            <table>
              <thead>
                <tr>
                  <th>Tipo de documento</th>
                  <th>Número de documento</th>
                  <th>Nombres</th>
                  <th>Apellido</th>
                  <th>Número de telefono</th>
                  <th>Estado</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrarPropietario.length > 0 ? (
                  filtrarPropietario.map((item) => (
                    <tr key={item._id}>
                      <td>{item.tipoDoc}</td>
                      <td>{item.numDoc}</td>
                      <td>{item.nombre}</td>
                      <td>{item.apellido}</td>
                      <td>{item.numTel}</td>
                      <td>{item.estado}</td>
                      <td className='options'>
                        <Link
                          to={`/actualizar-propietario/${item._id}`}
                          className='actualizar'
                        >
                          Actualizar
                        </Link>

                        <button
                          className='inactivar'
                          type='button'
                          onClick={() => {
                            const estadoNuevo =
                              item.estado === "Activo" ? "Inactivo" : "Activo";
                            setPropietarioSeleccionado(item);
                            setNuevoEstado(estadoNuevo);
                            setShowModal(true);
                          }}
                        >
                          {item.estado === "Activo" ? "Inactivar" : "Activar"}
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Cambiar estado del propietario</h3>
            <p>
              ¿Seguro que deseas cambiar el estado de
              <strong> {propietarioSeleccionado?.nombre} {propietarioSeleccionado?.apellido} </strong>
              a <strong>{nuevoEstado}</strong>?
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

export default AdminPropietario;
