import Navbar from '../../components/Navbar'
import ChamadoFormCreate from '../../components/ChamadoFormCreate'
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { Link, Navigate } from 'react-router-dom';

const ChamadosCreate = () => {
    const currentUser = useCurrentUser();
    const user = currentUser();

    // Se não tiver usuário logado, redireciona declarativamente
    if (!user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div>
            <Navbar />
            <h1 className='mx-2'>ChamadosCreate.jsx</h1>
            <Link to="/chamados" className='btn btn-primary mx-2'>Voltar</Link>
            <ChamadoFormCreate />
        </div>
    )
}

export default ChamadosCreate