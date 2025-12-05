import { Link, useNavigate } from "react-router-dom";
import { clearAuth } from "../../../utils/auth";
import logo from '../../../assets/img/logo/LogoSinFondo.png'

function RegistrarPropietario() {
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
                <div className="contentAdmin1">
                  <h1>Hola mundo</h1>
                </div>
            </div>
        </div>
    )
}

export default RegistrarPropietario