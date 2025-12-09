import './App.css'
import { Routes, Route } from "react-router-dom"
import Login from './components/login'
import { PrivateRouter } from './components/PrivateRouters/PrivateRouters'
import UserAdmin from './components/MenuAdmin/Usuarios/UsersAdmin'
import ControlDeEstado from './components/MenuSupervisor/ControlDeEstado'
import ConductorAdmin from './components/MenuAdmin/Conductor/ConductorAdmin'
import VehiculoAdmin from './components/MenuAdmin/Vehiculo/VehiculoAdmin'
import AdminPropietario from './components/MenuAdmin/Propietario/AdminPropie'
import RegistrarConductor from './components/MenuAdmin/Conductor/RegistrarConductor'
import RegistrarVehiculo from './components/MenuAdmin/Vehiculo/RegistrarVehiculo'
import RegistrarPropietario from './components/MenuAdmin/Propietario/RegistrarPropietario'
import RegistrarUsuario from './components/MenuAdmin/Usuarios/RegistrarUser'

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
        <Route path='/registrar-usuario' element = {
          <PrivateRouter allowedRoles={['Admin']}>
            <RegistrarUsuario />
          </PrivateRouter>
        } />

        <Route path='/conductor-admin' element = {
          <PrivateRouter allowedRoles={['Admin']}>
            <ConductorAdmin />
          </PrivateRouter>
        } />
        
        <Route path='/registrar-conductor' element = {
          <PrivateRouter allowedRoles={['Admin']}>
            <RegistrarConductor />
          </PrivateRouter>
        } />


        
        <Route path='/vehiculo-admin' element = {
          <PrivateRouter allowedRoles={['Admin']}>
            <VehiculoAdmin />
          </PrivateRouter>
        } />
        <Route path='/registrar-vehiculo' element = {
          <PrivateRouter allowedRoles={['Admin']}>
            <RegistrarVehiculo />
          </PrivateRouter>
        } />
        


        
        <Route path='/propietario-admin' element = {
          <PrivateRouter allowedRoles={['Admin']}>
            <AdminPropietario />
          </PrivateRouter>
        } />
        <Route path='/registrar-propietario' element = {
          <PrivateRouter allowedRoles={['Admin']}>
            <RegistrarPropietario />
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
