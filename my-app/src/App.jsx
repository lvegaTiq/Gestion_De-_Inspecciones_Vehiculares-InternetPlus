import './App.css'
import { Routes, Route } from "react-router-dom"
import Login from './components/login'
import { PrivateRouter } from './components/PrivateRouters/PrivateRouters'
import UserAdmin from './components/MenuAdmin/Usuarios/UsersAdmin'
import ControlDeEstado from './components/MenuSupervisor/ControlDeEstado'
import ConductorAdmin from './components/MenuAdmin/Conductor/ConductorAdmin'
import VehiculoAdmin from './components/MenuAdmin/Vehiculo/VehiculoAdmin'
import AdminPropietario from './components/MenuAdmin/Propietario/AdminPropie'

function App() {

  return (
    <div className='Application'>
      <Routes>
        <Route path='/' element={<Login />}/>
        {/*Rutas Administrador */}
        <Route path='/menu-admin' element={
          <PrivateRouter allowedRoles={['Admin']}>
            <UserAdmin />
          </PrivateRouter>
        } />
        <Route path='/conductor-admin' element = {
          <PrivateRouter allowedRoles={['Admin']}>
            <ConductorAdmin />
          </PrivateRouter>
        } />
        
        <Route path='/vehiculo-admin' element = {
          <PrivateRouter allowedRoles={['Admin']}>
            <VehiculoAdmin />
          </PrivateRouter>
        } />
        
        <Route path='/propietario-admin' element = {
          <PrivateRouter allowedRoles={['Admin']}>
            <AdminPropietario />
          </PrivateRouter>
        } />

        {/*Rutas supervisor */}
        <Route path='/menu-supervisor' element={
          <PrivateRouter allowedRoles={['Supervisor']}>
            <ControlDeEstado />
          </PrivateRouter>
        } />
      </Routes>
    </div>
  )
}

export default App
