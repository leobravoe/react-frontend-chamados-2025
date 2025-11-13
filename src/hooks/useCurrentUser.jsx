// src/auth/useCurrentUser.js
import { jwtDecode } from "jwt-decode";

const useCurrentUser = () => {
    return (
        () => {
            const token = sessionStorage.getItem("at"); // ou de onde você guarda

            if (!token) return null;

            try {
                const decoded = jwtDecode(token); // { sub, email, exp, roles, ... }
                return decoded;
            } catch (err) {
                console.error("Token inválido:", err);
                return null;
            }
        }
    );
}

export { useCurrentUser }
