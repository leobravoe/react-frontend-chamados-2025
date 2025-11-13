import Navbar from '../../components/Navbar'
import ChamadoFormCreate from '../../components/ChamadoFormCreate'
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom'

const ChamadosCreate = () => {
    const currentUser = useCurrentUser();
    const navigate = useNavigate();
    const user = currentUser();

    if (!user) navigate("/");

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