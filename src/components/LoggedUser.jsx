// LoggedUser.jsx
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useAuthFetch } from "../hooks/useAuthFetch";
import { useNavigate } from "react-router-dom";

const LoggedUser = () => {
    const currentUser = useCurrentUser();
    const navigate = useNavigate();
    const authFetch = useAuthFetch();
    const user = currentUser();

    const handleLogoutClick = async (e) => {
        e.preventDefault();
        try {
            await authFetch("http://localhost:3000/api/usuarios/logout", {
                method: 'POST',
                credentials: "include"
            });
            sessionStorage.removeItem("at");
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    }

    if (!user) return null;

    return (
        <ul className="nav-item dropdown m-0 p-0">
            <button
                className="nav-link dropdown-toggle bg-transparent border-0"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                {user.nome}
            </button>

            <ul className="dropdown-menu dropdown-menu-end">
                <li>
                    <button className="dropdown-item text-center" type="button" onClick={handleLogoutClick}>
                        Desconectar
                    </button>
                </li>
            </ul>
        </ul>
    );
};

export default LoggedUser;
