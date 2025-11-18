import { useAuth } from '../../auth/useAuth';
import Navbar from '../../components/shared/Navbar'
import ChamadoFormCreate from '../../components/chamados/ChamadoFormCreate'
import { Link, Navigate } from 'react-router-dom';

const ChamadosCreate = () => {
    const { user } = useAuth(); // agora vem do contexto

    // Se não tiver usuário logado, redireciona declarativamente
    if (!user) {
        return <Navigate to="/usuarios/login" replace />;
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