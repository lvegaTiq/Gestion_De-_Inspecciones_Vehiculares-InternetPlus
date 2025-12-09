import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../assets/img/logo/LogoSinFondo.png'
import { clearAuth } from '../../../utils/auth';
import vehiculo from '../../../assets/img/Admin/VehiculoA.png'

function ActualizarVehiculo() {
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
                        <li><Link to='/vehiculo-admin'>Regresar</Link></li>
                        <li><button onClick={cerrarSesion}>Cerrar Sesión</button></li>
                    </ul>
                </div>
            </div>

            <div className="contentAdmin2">
              <div className="registerUser1">
                <img src={vehiculo} className="img1" alt="Usuario" />
                  <form action="">
                    <div className="contenedorFormulario1">
                      <div className="input1">
                        <label>Tipo vehiculo</label>
                        <input type="text" placeholder="Ingrese el tipo" />
                        <label>Placa</label>
                        <input type="text" placeholder="Ingrese la placa" />
                        
                        <label>Modelo</label>
                        <input type="text" placeholder="Ingrese el modelo" />

                        <label>Fehca de vencimiento SOAT</label>
                        <input type="Date" />
                        
                        <label>Fecha de vencimiento tecnomecanica</label>
                        <input type="Date" />

                      </div>
                    </div>
                    <button className="buttonregister">Registrar</button>
                  </form>
              </div>
            </div>
        </div>
    )
}

export default ActualizarVehiculo