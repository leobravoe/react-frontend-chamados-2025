import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

// src/App.jsx
const App = () => {
    return (
        <div>
            <Navbar />
            <h1 className="mx-2">App.jsx</h1>
            <Link to="/usuarios/login" className="btn btn-primary mx-2">Entrar com Usuários</Link>
            <Link to="/usuarios/register" className="btn btn-primary me-2">Registrar Usuários</Link>
            <Link to="/chamados" className="btn btn-primary me-2">Chamados</Link>
            <Link to="/chamados/create" className="btn btn-primary">Criar Chamados</Link>
        </div>
    )
}
export default App