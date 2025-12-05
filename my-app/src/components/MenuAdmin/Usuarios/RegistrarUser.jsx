import { Link, useNavigate } from "react-router-dom";
import { clearAuth } from "../../../utils/auth";
import logo from '../../../assets/img/logo/LogoSinFondo.png'
import user from '../../../assets/img/Admin/usuario.png'

  function RegistrarUsuario() {
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
            <div className="registerUser">
              <img src={user} alt="" />
                <form action="">
                  <div className="contenedorFormulario">
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
                      <label>Email</label>
                      <input type="text" placeholder="Ingrese el Email" />
                      
                    </div>
                    <div className="input1">
                      <label>Teléfono</label>
                      <input type="text" placeholder="Ingrese el numero de teléfono" />
                      <label>Contraseña</label>
                      <input type="text" placeholder="Ingrese la contraseña" />
                      <label>Confirmar contraseña</label>
                      <input type="text" placeholder="Confirme la contraseña" />
                      <label>Rol de usuario</label>
                      <select>
                        <option value="">-Seleccione una opción-</option>
                        <option value="Admin">Administrador</option>
                        <option value="Supervisor">Supervisor</option>
                      </select>
                    </div>
                  </div>
                  <button>Registrar</button>
                </form>
            </div>
          </div>
        </div>
    )
  }

  export default RegistrarUsuario