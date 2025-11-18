// src/hooks/useAuthFetch.jsx

// Este hook cria uma função "authFetch" que faz requisições HTTP com:
// 1) Access Token no header Authorization (quando existir em sessionStorage);
// 2) Cookies incluídos (credentials: 'include') — necessário para enviar o refresh_token HttpOnly;
// 3) Renovação automática do access token quando a API responder 401 (não autorizado).
//
// Como usar:
//   const authFetch = useAuthFetch();
//   const abort = new AbortController();
//   const res = await authFetch('http://localhost:3000/api/chamados', {
//     method: 'GET',
//     signal: abort.signal,
//   });
//
// Observações importantes:
// - Este hook **precisa** ser usado **dentro de um componente React** (pois usa useNavigate).
// - A URL pode ser absoluta (http://localhost:3000/...)
// - O backend precisa expor POST /api/usuarios/refresh que lê o refresh_token do cookie HttpOnly
//   e retorna { access_token: "..." } num 200 OK. Esse access será gravado em sessionStorage.

import { useNavigate } from "react-router-dom";

const useAuthFetch = () => {
    const navigate = useNavigate();

    return (
        /**
         * authFetch(url, fetchOptions)
         * @param {string} url                URL absoluta para a API.
         * @param {RequestInit} fetchOptions  Mesmo objeto do fetch nativo (method, headers, body, signal, etc.).
         * @returns {Promise<Response>}       Response do fetch. Se 401 e o refresh tiver sucesso, refaz 1x e retorna a nova Response.
         */
        async (url, fetchOptions = {}) => {
            const { signal, headers: originalHeaders, ...restOptions } = fetchOptions;

            // Monta os headers com qualquer valor que o chamador tenha passado,
            // e adiciona "Authorization: Bearer <access_token>" se existir em sessionStorage.
            const headers = new Headers(originalHeaders || {});
            const accessToken = sessionStorage.getItem("at");
            if (accessToken) {
                headers.set("Authorization", `Bearer ${accessToken}`);
            }

            // Opções base para o fetch (usadas tanto na 1ª quanto na 2ª tentativa)
            const baseOptions = {
                ...restOptions,
                signal,
            };

            // 1ª tentativa de requisição
            let res = await fetch(url, { ...baseOptions, headers });

            // Se NÃO for 401, devolve a resposta imediatamente (200/201/204/403/404/500, etc.)
            if (res.status !== 401) {
                return res;
            }

            // 401 → tenta renovar o access token usando o refresh token (cookie HttpOnly)
            const refreshRes = await fetch("http://localhost:3000/api/usuarios/refresh", {
                method: "POST",
                credentials: "include", // envia cookie HttpOnly do refresh
                signal,
            });

            // Falha ao renovar (ex.: refresh expirado/inválido) → limpa access token e vai para login
            if (!refreshRes.ok) {
                sessionStorage.removeItem("at");
                navigate("/usuarios/login", { replace: true });
                return res; // mantém a Response 401 original
            }

            // Tenta extrair o novo access token do corpo da resposta do /refresh
            const data = await refreshRes.json().catch(() => ({}));
            const newAccessToken = data?.access_token;

            // Se não veio token, trata como sessão inválida/expirada
            if (!newAccessToken) {
                sessionStorage.removeItem("at");
                navigate("/usuarios/login", { replace: true });
                return res;
            }

            // Guarda o novo access token e refaz a requisição original **apenas uma vez**
            sessionStorage.setItem("at", newAccessToken);
            headers.set("Authorization", `Bearer ${newAccessToken}`);

            // 2ª tentativa (após refresh bem-sucedido)
            res = await fetch(url, { ...baseOptions, headers });

            return res;
        }
    );
};

export { useAuthFetch };

