import { Link, useNavigate } from "react-router-dom";
import { clearAuth } from "../../../utils/auth";
import logo from '../../../assets/img/logo/LogoSinFondo.png'
import propietatio from '../../../assets/img/Admin/propietario.png'


function ActualizarPropietario() {
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
            <div className="contentAdmin2">
              <div className="registerUser1">
                <img src={propietatio} className="img1" alt="Usuario" />
                  <form action="">
                    <div className="contenedorFormulario1">
                      <div className="input1">
                        <label>Nombre</label>
                        <input type="text" placeholder="Ingrese el nombre" />
                        <label>Apellido</label>
                        <input type="text" placeholder="Ingrese el apellido" />
                        <label>Tipo de documento</label>
                        <select>
                          <option value="">-Seleccione una opción-</option>
                          <option value="Cedula de ciudadania">Cedula de ciudadania</option>
                          <option value="Cedula de extranjería">Cedula de extranjería</option>
                          <option value="Pasaporte">Pasaporte</option>
                        </select>
                        <label>Numero de documento</label>
                        <input type="text" placeholder="Ingrese el numero de documento" />

                        <label>Teléfono</label>
                        <input type="text" placeholder="Ingrese el numero de teléfono" />

                      </div>
                    </div>
                    <button className="buttonregister">Registrar</button>
                  </form>
              </div>
            </div>
        </div>
    )
}

export default ActualizarPropietario