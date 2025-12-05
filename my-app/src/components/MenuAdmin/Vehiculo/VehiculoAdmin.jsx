import { Link, useNavigate } from 'react-router-dom';
import { clearAuth } from '../../../utils/auth';
import logo from '../../../assets/img/logo/LogoSinFondo.png'

function VehiculoAdmin() {
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
                        <li><Link to='/vehiculo-admin'style={{
                            'text-decoration':' underline'
                        }}>Vehiculo</Link></li>
                        <li><Link to='/propietario-admin'>Popietario</Link></li>
                        <li><button onClick={cerrarSesion}>Cerrar Sesión</button></li>
                    </ul>
                </div>
            </div>
            <div className="contentAdmin2">
                <div className="tablausers">
                    <div className="barrabusqueda">
                        <div className="textBarraBusqueda">
                            <h4>Vehiculos</h4>
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
                                    <th>Tipo vehículo</th>
                                    <th>Placa</th>
                                    <th>Modelo</th>
                                    <th>Fecha SOAT</th>
                                    <th>Fecha técno-mecánica</th>
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
                                    <td className='options'>
                                        <button className='actualizar'>Actualizar</button>
                                        <button className='actualizar'>Generar reporte</button>
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
export default VehiculoAdmin