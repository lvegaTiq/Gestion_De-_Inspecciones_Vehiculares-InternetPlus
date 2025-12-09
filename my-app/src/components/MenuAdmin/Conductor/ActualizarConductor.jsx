import { Link, useNavigate } from "react-router-dom";
import { clearAuth } from "../../../utils/auth";
import logo from '../../../assets/img/logo/LogoSinFondo.png'
import conductor from '../../../assets/img/Admin/conductor.png'
import { useRef, useState } from "react";
import { MdDelete } from "react-icons/md";
import { LuUpload } from "react-icons/lu";


function ActualizarConductor() {
    const navigate = useNavigate();
    const cerrarSesion = ()=>{
        clearAuth()
        return navigate('/')
    }

    const inputRef =  useRef();
    const [selectFile, setSelectFile] = useState(null);

    const handleOnchange = (event)=>{
        if(event.target.files && event.target.files.length > 0){
            const file = event.target.files[0];

            if(!file.type.startsWith("image/")){
                alert("Solo se pertmiten imagenes")
                return
            }
            
            setSelectFile(file);
        }
    };

    const onChangeFile = ()=>{
       inputRef.current.click()
    }

    const removeFile = ()=>{
       setSelectFile(null)
       inputRef.current.value = ""
    }

    return(
        <div className="contentAdmin">
            <div className="navAdmin">
                <img src={logo} alt='Logo InternetPlus'/>
                <div className="navbar">
                    <ul className='menu'>
                        <li><Link to='/conductor-admin'>Regresar</Link></li>
                        <li><button onClick={cerrarSesion}>Cerrar Sesión</button></li>
                    </ul>
                </div>
            </div>
            <div className="contentAdmin2">
              <div className="registerUser">
                <img src={conductor} className="img1" alt="Conductor" />
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
                        <label>Número de documento</label>
                        <input type="text" placeholder="Ingrese el numero de documento" />
                      </div>
                      <div className="input1">
                        <label>Email</label>
                        <input type="text" placeholder="Ingrese el Email" />
                        
                        <label>Teléfono</label>
                        <input type="text" placeholder="Ingrese el numero de teléfono" />
                        


                        <label>Licencia</label>
                        <input 
                            type="file" 
                            ref={inputRef} 
                            style={{display:"none",}}
                            onChange={handleOnchange}
                        />
                        {!selectFile ? (
                            <button type="button" className="file-btn" onClick={onChangeFile}>
                                Subir imagen
                            </button>
                        ) : (
                            <div className="preview-container">
                                <img 
                                    src={URL.createObjectURL(selectFile)} 
                                    alt="Licencia"
                                    className="preview-img"
                                />
                            </div>
                        )}


                        {selectFile && 
                        <div className="select-file">
                            <p>Nombre</p>
                            <p>{selectFile.name}</p>
                            <button onClick={removeFile}>
                                <span>
                                    <MdDelete />
                                </span>
                            </button>
                        </div>}
                        
                      </div>
                    </div>
                    <button className="buttonregister">Registrar</button>
                  </form>
              </div>
            </div>
        </div>
    )
}

export default ActualizarConductor