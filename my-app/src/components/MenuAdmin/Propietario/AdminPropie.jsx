import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../assets/img/logo/LogoSinFondo.png'
import { clearAuth } from '../../../utils/auth';

function AdminPropietario() {
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
                        <li><Link to='/menu-admin'>Usuarios</Link></li>
                        <li><Link to='/conductor-admin'>Conductor</Link></li>
                        <li><Link to='/vehiculo-admin'>Vehiculo</Link></li>
                        <li><Link to='/propietario-admin'style={{
                            'text-decoration':' underline'
                        }}>Popietario</Link></li>
                        <li><button onClick={cerrarSesion}>Cerrar Sesión</button></li>
                    </ul>
                </div>
            </div>
            <div className="contentAdmin2">
                <div className="tablausers">
                    <div className="barrabusqueda">
                        <div className="textBarraBusqueda">
                            <h4>Propietarios</h4>
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
                                    <th>Número de documento</th>
                                    <th>Nombres</th>
                                    <th>Apellido</th>
                                    <th>Número de telefono</th>
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

export default AdminPropietario