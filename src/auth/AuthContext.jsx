// src/auth/AuthContext.jsx
import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// Mesma API_BASE_URL que você usa no restante do projeto
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AuthContext = createContext({
    user: null,
    setUser: () => {},
    authLoading: true,
});

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const bootstrapAuth = async () => {
            try {
                // 1) Tenta reaproveitar o access_token da sessionStorage, se existir
                const storedToken = sessionStorage.getItem("at");

                if (storedToken) {
                    try {
                        const decoded = jwtDecode(storedToken);

                        // Se não tiver exp no payload ou ainda não expirou → usa direto e encerra
                        if (!decoded.exp || decoded.exp * 1000 > Date.now()) {
                            setUser(decoded);
                            return;
                        }
                    } catch (err) {
                        console.error("Token inválido na sessionStorage:", err);
                        sessionStorage.removeItem("at");
                    }
                }

                // 2) Não tem access token válido → tenta usar o refresh_token (cookie HttpOnly)
                try {
                    const res = await fetch(
                        `${API_BASE_URL}/api/usuarios/refresh`,
                        {
                            method: "POST",
                            credentials: "include", // envia o cookie de refresh
                        }
                    );

                    // Se o refresh falhar (401/403/etc.), considera sessão inválida
                    if (!res.ok) {
                        sessionStorage.removeItem("at");
                        setUser(null);
                        return;
                    }

                    const data = await res.json().catch(() => ({}));
                    const newToken = data?.access_token;

                    // Se o backend não mandou access_token, trata como não logado
                    if (!newToken) {
                        sessionStorage.removeItem("at");
                        setUser(null);
                        return;
                    }

                    // Guarda o novo access token
                    sessionStorage.setItem("at", newToken);

                    // Decodifica o token e popula o usuário no contexto
                    try {
                        const decoded = jwtDecode(newToken);
                        setUser(decoded);
                    } catch (err) {
                        console.error(
                            "Falha ao decodificar token vindo do /refresh:",
                            err
                        );
                        setUser(null);
                    }
                } catch (err) {
                    console.error("Erro ao chamar /api/usuarios/refresh:", err);
                    setUser(null);
                }
            } finally {
                // Em qualquer caso, encerra o estado de loading
                setAuthLoading(false);
            }
        };

        bootstrapAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, authLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
