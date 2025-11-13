// src/pages/usuarios/UsuariosLogin.jsx
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
// import UsuariosFormLogin from "../../components/UsuariosFormLogin";

const UsuariosLogin = () => {
    return (
        <div>
            <Navbar />
            <h1 className="mx-2">UsuariosLogin.jsx</h1>
            <Link to="/" className="btn btn-primary mx-2">Voltar</Link>
            {/* <UsuariosFormLogin /> */}
        </div>
    );
};

export default UsuariosLogin;
