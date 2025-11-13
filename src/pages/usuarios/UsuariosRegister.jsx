// src/pages/usuarios/UsuariosRegister.jsx
import { Link } from 'react-router-dom'
import Navbar from "../../components/Navbar"
// import UsuariosFormRegister from '../../components/UsuariosFormRegister'

const UsuariosRegister = () => {
    return (
        <div>
            <Navbar />
            <h1 className='mx-2'>UsuariosRegister.jsx</h1>
            <Link to="/" className="btn btn-primary mx-2">Voltar</Link>
            {/* <UsuariosFormRegister /> */}
        </div>
    )
}

export default UsuariosRegister
