import logo from '../assets/img/logo/LogoSinFondo.png'

function Login() {
    return(
        <div>
            <div className="contentLogin">
                
            <div className="navlogin">
                <img src={logo} alt="Logo" />
            </div>
                <div className="contentl">
                    <h1>Login</h1>
                    <form action="">
                        <label htmlFor="">Usuario</label><br />
                        <input type="Ingresar correo" /><br /><br />
                        <label htmlFor="">Password</label><br />
                        <input type="Ingresar contraseña" /><br /><br />
                        <div className='button'>
                            <button type="submit">Ingresar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login