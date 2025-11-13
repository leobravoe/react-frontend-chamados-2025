import Navbar from '../../components/Navbar'
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { Navigate } from 'react-router-dom';

const ChamadosEdit = () => {
    const currentUser = useCurrentUser();
    const user = currentUser();

    // Se não tiver usuário logado, redireciona declarativamente
    if (!user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div>
            <Navbar />
            <h1 className='mx-2'>ChamadosEdit.jsx</h1>
        </div>
    )
}

export default ChamadosEdit