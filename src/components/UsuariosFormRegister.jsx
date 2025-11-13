// src/components/UsuariosFormRegister.jsx
//
// OBJETIVO DO ARQUIVO
// -----------------------------------------------------------------------------
// Este componente exibe um formulário de REGISTRO de usuário.
// Ao enviar, ele chama POST /api/usuarios/register no backend.
// Se der certo, o backend devolve:
//   - access_token (curta duração) → guardamos na sessionStorage
//   - refresh token (longa duração) → vem em cookie HttpOnly (o JS não vê)
// Depois do registro bem-sucedido, redirecionamos para "/chamados".
//
// -----------------------------------------------------------------------------
// 1) useState: cria "estados" reativos (nome, email, senha, loading, error).
// 2) useNavigate: permite redirecionar para outra rota sem recarregar a página.
// 3) fetch(..., { credentials: "include" }): necessário para o navegador
//    ENVIAR/RECEBER cookies (ex.: refresh_token HttpOnly) em requisições CORS.
// 4) sessionStorage.setItem("at", ...): guardamos o access token na sessão,
//    pois ele é de curta duração e não deve persistir além da aba atual.
// 5) Tratamento de erro: se a resposta não for OK (4xx/5xx), exibimos um toast
//    com a mensagem vinda da API (quando existir) ou uma mensagem genérica.

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UsuariosFormRegister = () => {
    // Estados controlando os inputs e a UI:
    // - nome, email, senha: valores dos campos do formulário.
    // - loading: enquanto a requisição estiver em andamento.
    // - error: mensagem exibida no toast quando algo dá errado.
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    // Hook do React Router para navegar após o sucesso.
    const navigate = useNavigate();

    // Handler do submit do formulário.
    async function handleSubmit(e) {
        e.preventDefault();     // impede recarregar a página
        setError("");           // limpa erro anterior (se houver)
        setLoading(true);       // ativa spinner/botão desabilitado

        try {
            // Chamada à API de registro.
            // IMPORTANTE: credentials: "include" → habilita cookies (refresh HttpOnly).
            const res = await fetch("http://localhost:3000/api/usuarios/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" }, // corpo é JSON
                credentials: "include", // recebe/enviar cookies (refresh HttpOnly)
                body: JSON.stringify({ nome, email, senha }),    // payload
            });

            // Tentamos ler JSON mesmo se der erro, para extrair "erro" da API.
            // Se o corpo vier vazio ou inválido, caímos no objeto {}.
            const data = await res.json().catch(() => ({}));

            // Qualquer status fora da faixa 200–299 entra aqui como erro.
            if (!res.ok) {
                throw new Error(data?.erro || "Falha no login");
            }

            // Esperamos um access_token no corpo da resposta.
            const at = data?.access_token;
            if (!at) throw new Error("Resposta sem access_token");

            // Guardamos APENAS o access token (curta duração) na sessionStorage.
            // O refresh token NÃO é salvo aqui; ele está no cookie HttpOnly (invisível ao JS).
            sessionStorage.setItem("at", at);

            // Redireciona para a lista de chamados após o registro/autenticação.
            navigate("/chamados");
        } catch (err) {
            // Exibe mensagem de erro no toast (vinda da API ou genérica).
            setError(err.message || "Erro inesperado");
        } finally {
            // Independentemente de sucesso/erro, finaliza o estado de loading.
            setLoading(false);
        }
    }

    return (
        <div>
            {/* Toast simples de erro (usa classes do Bootstrap).
               Renderiza somente quando "error" tem conteúdo. */}
            {error && <div className="toast-container position-fixed bottom-0 end-0 p-3">
                <div className="toast text-bg-danger bg-opacity-50 show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="toast-header">
                        <strong className="me-auto">Erro</strong>
                        {/* Botão para fechar o toast limpando a mensagem de erro */}
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={() => setError(null)}
                        >
                        </button>
                    </div>
                    <div className="toast-body">
                        {error}
                    </div>
                </div>
            </div>}

            {/* Formulário controlado:
                - value vem do estado
                - onChange atualiza o estado */}
            <form onSubmit={handleSubmit} className="m-2">
                <div className="my-2">
                    <label htmlFor="id-input-nome" className="form-label">Nome</label>
                    <input
                        id="id-input-nome"
                        type="text"
                        className="form-control"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required // atributo HTML: impede submit se estiver vazio
                        placeholder="Digite seu nome"
                    />
                </div>

                <div className="my-2">
                    <label htmlFor="id-input-id" className="form-label">E-mail</label>
                    <input
                        id="id-input-id"
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Digite seu e-mail"
                    />
                </div>

                <div className="my-2">
                    <label htmlFor="id-input-senha" className="form-label">Senha</label>
                    <input
                        id="id-input-senha"
                        type="password"
                        className="form-control"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        placeholder="Digite sua senha"
                    />
                </div>

                {/* Botão desabilita enquanto loading=true para evitar duplo submit */}
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Registrando…" : "Registrar"}
                </button>
            </form>
        </div>
    );
};

export default UsuariosFormRegister;