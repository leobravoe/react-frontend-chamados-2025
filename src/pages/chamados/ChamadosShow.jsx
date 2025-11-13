import Navbar from '../../components/Navbar'
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { Navigate } from 'react-router-dom';

const ChamadosShow = () => {
    const currentUser = useCurrentUser();
    const user = currentUser();

    // Se não tiver usuário logado, redireciona declarativamente
    if (!user) {
        return <Navigate to="/usuarios/login" replace />;
    }

    return (
        <div>
            <Navbar />
            <h1 className='mx-2'>ChamadosShow.jsx</h1>
        </div>
    )
}

export default ChamadosShow