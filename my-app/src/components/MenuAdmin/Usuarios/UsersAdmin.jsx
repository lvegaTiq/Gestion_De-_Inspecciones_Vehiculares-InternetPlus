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
        const response = await fetch('http://localhost:3000/api/users-get',{
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
        const response = await fetch('http://localhost:3000/api/conductor-get',{
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
        const response = await fetch('http://localhost:3000/api/propietario-get',{
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
        const response = await fetch('http://localhost:3000/api/vehiculo-get',{
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
                                    <th>ID</th>
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
                                      <td>{item._id}</td>
                                      <td>{item.tipoDocumento}</td>
                                      <td>{item.documento}</td>
                                      <td>{item.nombre}</td>
                                      <td>{item.apellido}</td>
                                      <td>{item.telefono}</td>
                                      <td>{item.email}</td>
                                      <td>{item.password}</td>
                                      <td>{item.estado}</td>
                                      <td className='options'>
                                        <button className='actualizar'>Actualizar</button>
                                        <button className='inactivar'>Inactivar</button>
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
    )
}

export default UserAdmin