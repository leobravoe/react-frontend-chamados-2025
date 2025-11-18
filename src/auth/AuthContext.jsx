// src/auth/AuthContext.jsx
import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext({
    user: null,
    setUser: () => { },
});

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem("at");

        if (!token) {
            setUser(null);
            return;
        }

        try {
            const decoded = jwtDecode(token);

            // valida expiração se quiser
            if (decoded.exp && decoded.exp * 1000 < Date.now()) {
                setUser(null);
            } else {
                setUser(decoded);
            }
        } catch (err) {
            console.error("Token inválido:", err);
            setUser(null);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };