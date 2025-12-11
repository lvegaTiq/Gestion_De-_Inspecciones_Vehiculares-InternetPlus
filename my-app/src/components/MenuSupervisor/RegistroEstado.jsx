import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/img/logo/LogoSinFondo.png'
import { clearAuth } from '../../utils/auth';

function RegistroEstado() {
    const navigate = useNavigate();
    const cerrarSesion = ()=>{
        clearAuth();
        return navigate('/')
    } 

    return(
        <div className="contentAdmin">
            <div className="navAdmin">
                <img src={logo} alt="Logo InternetPlus" />
                <div className="navbar">
                    <ul className='menu'>
                        <li><Link to='/menu-supervisor'>Regresar</Link></li>
                        <li><button onClick={cerrarSesion}>Cerrar Sesión</button></li>
                    </ul>
                </div>
            </div>
            <div className="contentRegisterEstado">
                <div className="contentFormEstado">
                    <h1>Registrar estado del vehiculo</h1>
                    <form action="">
                        <label htmlFor="">hola</label>
                        <input type="Date" name="" id="" />
                        <label htmlFor="">hola</label>
                        <input type="Number" name="" id="" />
                        <div className="niveles">
                            <h3>Nivel</h3>
                            <label htmlFor="">hola</label>
                            <input type="checkbox" name="" id="" />
                            <label htmlFor="">hola</label>
                            <input type="checkbox" name="" id="" />
                            <label htmlFor="">hola</label>
                            <input type="checkbox" name="" id="" />
                        </div>
                        <div className="pedal"> 
                            <h3>Pedal</h3>
                            <label htmlFor="">hola</label>
                            <input type="checkbox" name="" id="" />
                            <label htmlFor="">hola</label>
                            <input type="checkbox" name="" id="" />
                            <label htmlFor="">hola</label>
                            <input type="checkbox" name="" id="" />
                        </div>
                        <div className="luces"> 
                            <h3>Luces</h3>
                            <label htmlFor="">hola</label>
                            <input type="checkbox" name="" id="" />
                            <label htmlFor="">hola</label>
                            <input type="checkbox" name="" id="" />
                            <label htmlFor="">hola</label>
                            <input type="checkbox" name="" id="" />
                        </div>
                        <div className="botiquin"> 
                            <h3>Botiquin</h3>
                            <label htmlFor="">hola</label>
                            <input type="checkbox" name="" id="" />
                            <label htmlFor="">hola</label>
                            <input type="checkbox" name="" id="" />
                            <label htmlFor="">hola</label>
                            <input type="checkbox" name="" id="" />
                        </div>
                        <div className="varios"> 
                            <h3>Varios</h3>
                            <label htmlFor="">hola</label>
                            <input type="checkbox" name="" id="" />
                            <label htmlFor="">hola</label>
                            <input type="checkbox" name="" id="" />
                            <label htmlFor="">hola</label>
                            <input type="checkbox" name="" id="" />
                        </div>
                        <label htmlFor="">hola</label>
                        <input type="text" />
                        
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RegistroEstado