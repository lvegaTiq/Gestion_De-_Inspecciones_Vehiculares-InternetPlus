import './App.css'
import { Routes, Route } from "react-router-dom"
import Login from './components/login'

function App() {

  return (
    <div className='Application'>
      <Routes>
        <Route path='/' element={<Login />}/>
      </Routes>
    </div>
  )
}

export default App
