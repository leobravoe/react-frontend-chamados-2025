// src/pages/usuarios/UsuariosRegister.jsx
import { Link } from 'react-router-dom'
import Navbar from "../../components/Navbar"
import UsuariosFormRegister from '../../components/UsuariosFormRegister'
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { Navigate } from 'react-router-dom';

const UsuariosRegister = () => {
    const currentUser = useCurrentUser();
    const user = currentUser();

    // Se tiver usuário logado, redireciona declarativamente
    if (user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div>
            <Navbar />
            <h1 className='mx-2'>UsuariosRegister.jsx</h1>
            <Link to="/" className="btn btn-primary mx-2">Voltar</Link>
            <UsuariosFormRegister />
        </div>
    )
}

export default UsuariosRegister
