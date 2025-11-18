// src/components/UsuariosFormLogin.jsx
//
// OBJETIVO
// -----------------------------------------------------------------------------
// Componente de LOGIN.
// Envia email/senha para POST /api/usuarios/login.
// Se der certo, o backend retorna:
//   - access_token (curta duração) → salvamos na sessionStorage
//   - refresh token (longa duração) → vem num cookie HttpOnly (o JS não acessa)
// Depois do login, atualiza o contexto de autenticação e redireciona para "/".
//
// -----------------------------------------------------------------------------
// • useState: guarda valores reativos (email, senha, loading, error).
// • useNavigate: redireciona o usuário sem recarregar a página.
// • fetch + credentials:"include": permite ENVIAR/RECEBER cookies (p/ refresh).
// • sessionStorage: armazena o access token (curta duração).
// • useAuth: atualiza o usuário logado no contexto (setUser).
// • jwtDecode: decodifica o access_token para preencher o contexto.
// • Tratamento de erro: se a API responder 4xx/5xx, mostramos um toast.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Toast from "../shared/Toast";
import { useAuth } from "../../auth/useAuth";

const UsuariosFormLogin = () => {
  // Estados controlados dos inputs e da UI:
  const [email, setEmail] = useState("");        // valor do campo "E-mail"
  const [senha, setSenha] = useState("");        // valor do campo "Senha"
  const [loading, setLoading] = useState(false); // indica requisição em andamento
  const [error, setError] = useState("");        // mensagem exibida no toast

  const navigate = useNavigate();                // para redirecionar após login
  const { setUser } = useAuth();                 // atualiza o usuário no contexto

  // Chamado quando o formulário é enviado
  async function handleSubmit(e) {
    e.preventDefault(); // evita recarregar a página
    setError("");       // limpa erro anterior (se houver)
    setLoading(true);   // desabilita botão/mostra "Entrando…"

    try {
      // Chamada à API de login:
      // - headers: mandamos JSON (email/senha)
      // - credentials: "include" → habilita cookies (refresh token HttpOnly)
      const res = await fetch("http://localhost:3000/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // recebe/enviar cookies (refresh HttpOnly)
        body: JSON.stringify({ email, senha }),
      });

      // Tentamos ler JSON (mesmo em erro) para extrair "erro" do backend
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // Se a API mandou { erro: "mensagem" }, usamos essa mensagem
        throw new Error(data?.erro || "Falha no login");
      }

      // Esperamos um access_token na resposta
      const at = data?.access_token;
      if (!at) throw new Error("Resposta sem access_token");

      // Guardamos APENAS o access token (curta duração) na sessionStorage
      // O refresh fica em cookie HttpOnly (não visível no JS)
      sessionStorage.setItem("at", at);

      // Atualiza o contexto de autenticação imediatamente
      try {
        const decoded = jwtDecode(at); // { sub, email, nome, exp, ... }
        setUser(decoded);
      } catch (e) {
        console.error("Falha ao decodificar access_token no login:", e);
        setUser(null);
      }

      // (Opcional) limpa o campo de senha
      setSenha("");

      // Redireciona para a página inicial (ou, se quiser, para "/chamados")
      navigate("/");
    } catch (error) {
      // Exibe a mensagem no toast
      setError(error.message || "Erro inesperado");
    } finally {
      // Sempre desliga o loading ao final (com sucesso ou erro)
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Toast simples de erro. Só aparece quando "error" tem conteúdo. */}
      {error && <Toast error={error} setError={setError} />}

      {/* Formulário controlado:
          - cada input usa value={estado}
          - onChange atualiza o estado correspondente */}
      <form onSubmit={handleSubmit} className="m-2">
        <div className="my-2">
          <label htmlFor="id-input-email" className="form-label">
            E-mail
          </label>
          <input
            id="id-input-email"
            type="email"
            className="form-control"
            value={email} // estado → input
            onChange={(e) => setEmail(e.target.value)} // input → estado
            required // validação HTML nativa
            placeholder="Digite seu e-mail"
          />
        </div>

        <div className="my-2">
          <label htmlFor="id-input-senha" className="form-label">
            Senha
          </label>
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

        {/* Enquanto loading=true, desabilita o botão e mostra "Entrando…" */}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
};

export default UsuariosFormLogin;
