import React from 'react'
import Navbar from '../../components/Navbar'
import ChamadosList from '../../components/ChamadosList'
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { Link, Navigate } from 'react-router-dom';

const ChamadosIndex = () => {
    const currentUser = useCurrentUser();
    const user = currentUser();

    // Se não tiver usuário logado, redireciona declarativamente
    if (!user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div>
            <Navbar />
            <h1 className='mx-2'>ChamadosIndex.jsx</h1>
            <Link to="/" className="btn btn-primary mx-2">Voltar</Link>
            <Link to="/chamados/create" className='btn btn-primary'>Criar chamado</Link>
            <ChamadosList />
        </div>
    );
}

export default ChamadosIndex;
