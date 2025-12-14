import logo from '../../../assets/img/logo/LogoSinFondo.png'
import Usarios from '../../../assets/img/Admin/usuario.png'
import VehiculoA from '../../../assets/img/Admin/VehiculoA.png'
import VehiculoR from '../../../assets/img/Admin/vehiculoR.png'
import Propietario from '../../../assets/img/Admin/propietario.png'
import Conductor from '../../../assets/img/Admin/conductor.png'
import { FcSearch } from "react-icons/fc";
import { Link, useNavigate } from 'react-router-dom'
import { clearAuth } from '../../../utils/auth'
import { useEffect, useState } from 'react'

function UserAdmin() {
    const [users, setUsers] = useState([]);
    const [propietario, setPropietario] = useState([]);
    const [conductor, setConductor] = useState([]);
    const [buenEstado, setBuenEstado] = useState(0);
    const [malEstado, setMalEstado] = useState(0);
    const navigate = useNavigate();
    const [search, setSearch] = useState("")
    const [errorMsg, setErrorMsg] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [nuevoEstado, setNuevoEstado] = useState("");

    const cerrarSesion = ()=>{
        clearAuth()
        return navigate('/')
    }

    const navigate1 = ()=>{
        navigate('/registrar-usuario')
    }

    useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://gestion-de-inspecciones-vehiculares.onrender.com/api/users-get',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
          throw new Error(`Error al momento de consultar la api`);
        }
        const result = await response.json();
        const data = result.data?.docs || [];
        setUsers(data);
      } catch (error) {
        console.error(error);
      }

      try{
        const response = await fetch('https://gestion-de-inspecciones-vehiculares.onrender.com/api/conductor-get',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
          throw new Error(`Error al momento de consultar la api`);
        }
        const result = await response.json();
        const data = result.data?.docs || [];
        setConductor(data);

      }catch(error){
        console.error(error);

      }
      try{
        const response = await fetch('https://gestion-de-inspecciones-vehiculares.onrender.com/api/propietario-get',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
          throw new Error(`Error al momento de consultar la api`);
        }
        const result = await response.json();
        const data = result.data?.docs || [];
        setPropietario(data);

      }catch(error){
        console.error(error);

      }
      try{
        const response = await fetch('https://gestion-de-inspecciones-vehiculares.onrender.com/api/vehiculo-get',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
          throw new Error(`Error al momento de consultar la api`);
        }
        const result = await response.json();
        const data = result.data?.docs || [];
         const buenos = data.filter(v => v.estado === "Buen estado").length;
        const malos = data.filter(v => v.estado === "Mal estado").length;

        setBuenEstado(buenos);
        setMalEstado(malos);

      }catch(error){
        console.error(error);

      }
    };
    fetchUsers();
  }, []);

    const usuariofiltrado = users.filter((item) => {
      const text = search.toLowerCase();
      return (
        item._id.toLowerCase().includes(text) ||
        item.documento.toLowerCase().includes(text) ||
        item.estado.toLowerCase().includes(text)
      );
    });

    const ejecutarCambioEstado = async () => {
      if (!usuarioSeleccionado) return;
    
      try {
        const resp = await fetch(`https://gestion-de-inspecciones-vehiculares.onrender.com/api/users-inactivar/${usuarioSeleccionado._id}`,{
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
      
        setUsers((prev) =>
          prev.map((u) =>
            u._id === usuarioSeleccionado._id
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

    return(
        <div className="contentAdmin">
            <div className="navAdmin">
                <img src={logo} alt='Logo InternetPlus'/>
                <div className="navbar">
                    <ul className='menu'>
                        <li><a href='#' style={{
                            'text-decoration':' underline'
                        }}>Usuarios</a></li>
                        <li><Link to='/conductor-admin'>Conductor</Link></li>
                        <li><Link to='/vehiculo-admin'>Vehiculo</Link></li>
                        <li><Link to='/propietario-admin'>Popietario</Link></li>
                        <li><button onClick={cerrarSesion}>Cerrar Sesión</button></li>
                    </ul>
                </div>
            </div>
            <div className="contentAdmin1">
                <div className="minicards">
                    <div className="card1">
                        <img src={Usarios} alt="usuarios" />
                        <div className="textcard">
                            <span>{users.length}</span>
                            <h3>Usuarios</h3>
                        </div>
                    </div>
                    <div className="card1">
                        <img src={VehiculoA} alt="Vehiculo Azul" />
                        <div className="textcard">
                            <span>{buenEstado}</span>
                            <h3>Estado Ok</h3>
                        </div>
                        
                    </div>
                    <div className="card1">
                        <img src={VehiculoR} alt="Vehiculo Rojo" />
                        <div className="textcard">
                            <span>{malEstado}</span>
                            <h3>Mal Estado</h3>
                        </div>
                        
                    </div>
                    <div className="card1">
                        <img src={Propietario} alt="Propietario" />
                        <div className="textcard">
                            <span>{propietario.length}</span>
                            <h3>Propietario</h3>
                        </div>
                        
                    </div>
                    <div className="card1">
                        <img src={Conductor} alt="Conductor" />
                        <div className="textcard">
                            <span>{conductor.length}</span>
                            <h3>Conductor</h3>
                        </div>
                    </div>
                </div>
                <div className="tablausers">
                    <div className="barrabusqueda">
                        <div className="textBarraBusqueda">
                            <h4>Usuarios</h4>
                        </div>
                        <input 
                            type="text" 
                            placeholder='🔍 Buscar usuario por ID, número de documento...'
                            value={search}
                            onChange={(e)=>setSearch(e.target.value)}
                        />
                        <button onClick={navigate1}>Registrar</button>
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
                                    <th>Email</th>
                                    <th>Password</th>
                                    <th>Estado</th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuariofiltrado.length > 0 ? (
                                  usuariofiltrado.map((item) => (
                                    <tr key={item._id}>
                                      <td>{item.tipoDocumento}</td>
                                      <td>{item.documento}</td>
                                      <td>{item.nombre}</td>
                                      <td>{item.apellido}</td>
                                      <td>{item.telefono}</td>
                                      <td>{item.email}</td>
                                      <td>{item.password}</td>
                                      <td>{item.estado}</td>
                                      <td className='options'>
                                        <Link to={`/actualizar-usuario/${item._id}`} className='actualizar'>Actualizar</Link>
                                        <button
                                          className='inactivar'
                                          type="button"
                                          onClick={()=>{
                                            const estadoNuevo = item.estado === "Activo" ? "Inactivo" : "Activo";
                                            setUsuarioSeleccionado(item);
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
                  <h3>Cambiar estado del usuario</h3>
                  <p>
                    ¿Seguro que deseas cambiar el estado de  
                    <strong> {usuarioSeleccionado?.nombre} {usuarioSeleccionado?.apellido} </strong> 
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
       
    )
}

export default UserAdmin