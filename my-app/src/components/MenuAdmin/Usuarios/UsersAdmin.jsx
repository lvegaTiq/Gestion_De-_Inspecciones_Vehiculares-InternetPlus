import logo from '../../../assets/img/logo/LogoSinFondo.png'
import Usarios from '../../../assets/img/Admin/usuario.png'
import VehiculoA from '../../../assets/img/Admin/VehiculoA.png'
import VehiculoR from '../../../assets/img/Admin/vehiculoR.png'
import Propietario from '../../../assets/img/Admin/propietario.png'
import Conductor from '../../../assets/img/Admin/conductor.png'
import { FcSearch } from "react-icons/fc";
import { Link, useNavigate } from 'react-router-dom'
import { clearAuth } from '../../../utils/auth'

function UserAdmin() {
    
    const navigate = useNavigate();
    const cerrarSesion = ()=>{
        clearAuth()
        return navigate('/')
    }

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
                            <span>0</span>
                            <h3>Usuarios</h3>
                        </div>
                    </div>
                    <div className="card1">
                        <img src={VehiculoA} alt="Vehiculo Azul" />
                        <div className="textcard">
                            <span>0</span>
                            <h3>Estado Ok</h3>
                        </div>
                        
                    </div>
                    <div className="card1">
                        <img src={VehiculoR} alt="Vehiculo Rojo" />
                        <div className="textcard">
                            <span>0</span>
                            <h3>Mal Estado</h3>
                        </div>
                        
                    </div>
                    <div className="card1">
                        <img src={Propietario} alt="Propietario" />
                        <div className="textcard">
                            <span>0</span>
                            <h3>Propietario</h3>
                        </div>
                        
                    </div>
                    <div className="card1">
                        <img src={Conductor} alt="Conductor" />
                        <div className="textcard">
                            <span>0</span>
                            <h3>Conductor</h3>
                        </div>
                    </div>
                </div>
                <div className="tablausers">
                    <div className="barrabusqueda">
                        <div className="textBarraBusqueda">
                            <h4>Usuarios</h4>
                        </div>
                        <input type="text" 
                            placeholder='🔍 Buscar usuario por ID, número de documento...'
                        />
                            <button>Registrar</button>
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
                                    <th>Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td className='options'>
                                        <button className='actualizar'>Actualizar</button>
                                        <button className='inactivar'>Inactivar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
       </div>
    )
}

export default UserAdmin