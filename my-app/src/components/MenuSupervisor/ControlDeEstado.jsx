import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/img/logo/LogoSinFondo.png'
import { clearAuth } from '../../utils/auth';
import { useEffect, useState } from 'react';

function ControlDeEstado() {
    const [data, setData]=useState([])
    const navigate = useNavigate();
    const cerrarSesion = ()=>{
        clearAuth();
        return navigate('/')
    }

    const navigate1 = () =>{
        navigate('/')
    }
    
    useEffect(()=>{
        const vehiculoData = async()=>{
            try{
                const response = await fetch(`http://localhost:3000/api/users-get`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                if(!response.ok){
                    throw new Error('Error al consultar los datos de la api')
                }

                const result = await response.json();
                const data = result.data.docs
                setData(data)

                const res = await fetch('http://localhost:3000/api/conductor-get')
                if(!res.ok){
                    throw new Error('Error al momento de consultar los datos')
                }
                const resultConductor = await res.json();
                const dataConductor = resultConductor.resultConductordar

            }catch(error){
                console.log()
            }
        }
    },[])

    return(
        <div className="contentAdmin">
            <div className="navAdmin">
                <img src={logo} alt='Logo InternetPlus'/>
                <div className="navbar">
                    <ul className='menu'>
                        <li><button onClick={cerrarSesion}>Cerrar Sesión</button></li>
                    </ul>
                </div>
            </div>
            <div className="contentSupervisor2">
                <div className="tableVehiculo1">
                    <div className="barrabusqueda">
                        <div className="textBarraBusqueda">
                            <h4>Vehiculos</h4>
                        </div>
                        <input type="text" placeholder='Buscar vehiculo por placa, tipo...' />
                        <button >Registrar</button>
                    </div>
                    <div className='tablausersData'>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tipo de vehiculo</th>
                                    <th>Placa</th>
                                    <th>Modelo</th>
                                    <th>Fecha del Soat</th>
                                    <th>FechaTecno</th>
                                    <th>Propietario</th>
                                    <th>Conductor</th>
                                    <th>Estado</th>
                                    <th>Estado del vehiculo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length > 0?(
                                    data.map((item, index)=>(
                                        <tr key={index}>
                                            <th>{item._id}</th>
                                            <th>{item.tipoVehiculo}</th>
                                            <th>{item.placa}</th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ControlDeEstado