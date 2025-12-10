import { useState } from 'react'
import logo from '../assets/img/logo/LogoSinFondo.png'
import {useNavigate} from 'react-router-dom';   
import { saveUserId, saveUserRol } from '../utils/auth';
import { useEffect } from 'react';

function Login() {
    const navigate = useNavigate()

    const [formDataLogin, setFormDataLogin]= useState({
        email:'',
        password: ''
    });

    const [formErrorsLogin, setFormErrorsLogin] = useState([]);
    const [submit, setSubmit] = useState(false);


    const InputChangeLogin = (e)=>{
        const {name, value} = e.target;
        setFormDataLogin({
            ...formDataLogin,
            [name]: value
        })
    }
    const validarCampos = async()=>{
        let userRole='';
        let userId='';
        let errors={};

        if(!formDataLogin.email){
            errors.email='Este campo es obligatorio'
        }
        if(!formDataLogin.password){
            errors.password='Este campo es obligatorio'
        }

        if(Object.keys(errors).length > 0){
            return { errors, userRole, userId}
        }

        try{
            const response = await fetch(`http://localhost:3000/api/users-get`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if(!response.ok){
                throw new Error('Error al consultar los usuarios de la api')
            }

            const data = await response.json()
            const results = data.data.docs;

            const Userlogger = results.find(user => user.email === formDataLogin.email && user.password === formDataLogin.password);

            if(Userlogger){
                userRole = Userlogger.role;
                userId = Userlogger._id
            }else{
                const emailExist = results.some((item)=> item.email === formDataLogin)
                if(!emailExist){
                    errors.email = "El correo es incorrecto"
                }else{
                    errors.password = "L a contraseña es incorrecta"
                }
            }
        }catch(error){
            console.error('Error al momento de acceder a la api', error)
        }
        return {errors,userRole, userId}
    }

    const handleSubmitLogin = async(e)=>{
        e.preventDefault();
        const {errors, userRole, userId} = await validarCampos();
        setFormErrorsLogin(errors)
        setSubmit(true)

        if(Object.keys(errors).length === 0){
            setSubmit(true)
            console.log('Redirigiendo segun el rol...')
            saveUserRol(userRole);
            saveUserId(userId);

            switch(userRole){
                case 'Admin': 
                    navigate('/menu-admin');
                    break

                case 'Supervisor': 
                    navigate('/menu-supervisor');
                    break;
                default:
                    console.log('Rol de usuario no reconocido');
                    break;
            }
        }
    }

    useEffect(()=>{
        if(Object.keys(formErrorsLogin).length === 0 && submit){
            console.log('formulario de iniciar sesion enviado correctamente: ', formDataLogin)
        }
    }, [formDataLogin, submit, formErrorsLogin])

    return(
        <div>
            <div className="contentLogin">
                
            <div className="navlogin">
                <img src={logo} alt="Logo" />
            </div>
                <div className="contentl">
                    <h1>Login</h1>
                    <form onSubmit={handleSubmitLogin}>
                        <label >Usuario</label><br />
                        <input
                            type='email'
                            placeholder="Ingresar correo" 
                            name='email'
                            value={formDataLogin.email}
                            onChange={InputChangeLogin}
                        /><br /><br />
                        <label >Password</label><br />
                        <input 
                            type='password'
                            placeholder="Ingresar contraseña"
                            name='password'
                            value={formDataLogin.password}
                            onChange={InputChangeLogin}
                        /><br /><br />
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