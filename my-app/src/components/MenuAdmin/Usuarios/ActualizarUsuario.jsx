import { Link, useNavigate } from "react-router-dom";
import { clearAuth } from "../../../utils/auth";
import logo from '../../../assets/img/logo/LogoSinFondo.png'
import user from '../../../assets/img/Admin/usuario.png'

  function ActualizarUsuario() {
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
                      <li><Link to='/menu-admin'>Regresar</Link></li>
                      <li><button onClick={cerrarSesion}>Cerrar Sesión</button></li>
                  </ul>
              </div>
          </div>
          <div className="contentAdmin2">
            <div className="registerUser">
              <img src={user} className="img1" alt="Usuario" />
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
                  <button className="buttonregister">Registrar</button>
                </form>
            </div>
          </div>
        </div>
    )
  }

  export default ActualizarUsuario