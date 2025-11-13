import Navbar from '../../components/Navbar'
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";

const ChamadosShow = () => {
    const currentUser = useCurrentUser();
    const navigate = useNavigate();
    const user = currentUser();

    if (!user) navigate("/");

    return (
        <div>
            <Navbar />
            <h1 className='mx-2'>ChamadosShow.jsx</h1>
        </div>
    )
}

export default ChamadosShow