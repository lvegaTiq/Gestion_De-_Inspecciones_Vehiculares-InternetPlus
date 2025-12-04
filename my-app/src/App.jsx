import './App.css'
import { Routes, Route } from "react-router-dom"
import Login from './components/login'
import { PrivateRouter } from './components/PrivateRouters/PrivateRouters'
import UserAdmin from './components/MenuAdmin/UsersAdmin'
import ControlDeEstado from './components/MenuSupervisor/ControlDeEstado'

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
