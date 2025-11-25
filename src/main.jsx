import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AuthProvider } from "./auth/AuthContext";

import App from './pages/App.jsx'
import Sobre from './pages/Sobre.jsx'
import Contato from './pages/Contato.jsx';

import ChamadosIndex from './pages/chamados/ChamadosIndex.jsx';
import ChamadosCreate from './pages/chamados/ChamadosCreate.jsx';
import ChamadosShow from './pages/chamados/ChamadosShow.jsx';
import ChamadosEdit from './pages/chamados/ChamadosEdit.jsx';

import UsuariosLogin from './pages/usuarios/UsuariosLogin.jsx';
import UsuariosRegister from './pages/usuarios/UsuariosRegister.jsx';

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.min.js"

const router = createBrowserRouter([
    { path: "/chamados-build/", element: <App /> },
    { path: "/chamados-build/sobre", element: <Sobre /> },
    { path: "/chamados-build/contato", element: <Contato /> },
    
    { path: "/chamados-build/chamados", element: <ChamadosIndex /> },
    { path: "/chamados-build/chamados/create", element: <ChamadosCreate /> },
    { path: "/chamados-build/chamados/:id", element: <ChamadosShow /> },
    { path: "/chamados-build/chamados/:id/edit", element: <ChamadosEdit /> },

    { path: "/chamados-build/usuarios/login", element: <UsuariosLogin /> },
    { path: "/chamados-build/usuarios/register", element: <UsuariosRegister /> },
]);

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <RouterProvider router={router} />
    </AuthProvider>
)