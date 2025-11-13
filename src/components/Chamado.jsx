// src/components/Chamado.jsx
//
// OBJETIVO
// -----------------------------------------------------------------------------
// Este componente é responsável por renderizar UM cartão de chamado e permitir
// que o usuário alterne o seu estado (ativo/inativo) diretamente no backend,
// usando o helper de requisições autenticadas (useAuthFetch).
//
// VISÃO GERAL
// -----------------------------------------------------------------------------
// - useAuthFetch: devolve uma função de busca autenticada (authFetch) que:
//     * Anexa Authorization: Bearer <access_token> (se existir em sessionStorage);
//     * Envia cookies (para o refresh_token HttpOnly);
//     * Tenta renovar o access token automaticamente quando a API responder 401;
//     * Refaz a requisição original uma única vez após o refresh.
// - Props:
//     * chamado: objeto com dados do chamado (id, texto, estado, url_imagem, etc.);
//     * setError: função vinda do componente pai para exibir mensagens de erro (ex.: toast);
//     * onChamadoEstadoChange: callback que o pai usa para atualizar a lista
//       local quando o backend devolve o chamado atualizado.
// - Interação principal:
//     * O botão "Ativo/Inativo" dispara um PATCH /api/chamados/:id trocando o
//       campo "estado" entre 'a' (ativo) e 'f' (fechado) e, em caso de sucesso,
//       notifica o pai via onChamadoEstadoChange(...).
//
// -----------------------------------------------------------------------------
// Abaixo está a implementação do componente, com comentários linha a linha.

import { useAuthFetch } from '../hooks/useAuthFetch';

// Componente responsável por renderizar UM chamado da lista.
// Props:
// - chamado: objeto com dados do chamado (id, texto, estado, url_imagem, etc.).
// - setError: função recebida do pai para exibir mensagens de erro (ex.: toast).
// - onChamadoEstadoChange: callback disparado quando o PATCH no backend
//   retorna o chamado atualizado; o pai usa isso para substituir o item na lista.
const Chamado = ({ chamado, setError, onChamadoEstadoChange }) => {
  // Obtém a função authFetch (um "fetch" com autenticação + refresh automático).
  const authFetch = useAuthFetch();

  // Handler do botão que alterna o estado do chamado (a <-> f).
  // a  = ativo/aberto
  // f  = fechado/inativo
  const handleEstadoChange = async () => {
    // Monta a URL do recurso que será atualizado (PATCH /api/chamados/:id).
    const url = `http://localhost:3000/api/chamados/${chamado.id}`;

    // Prepara o corpo da requisição. Aqui enviamos apenas o campo "estado"
    // trocando 'a' por 'f' e vice-versa. O backend fará a atualização parcial (PATCH).
    const payload = JSON.stringify({
      estado: chamado.estado === 'a' ? 'f' : 'a',
    });

    try {
      // Faz a chamada usando o helper autenticado.
      // Importante: adicionamos Content-Type: application/json porque o body é JSON.
      // O authFetch cuida de:
      //   - anexar Authorization: Bearer <token> (se existir);
      //   - credentials: 'include' (envio de cookies);
      //   - tentar /refresh em caso de 401 e refazer a requisição 1x.
      const res = await authFetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
      });

      // Se a resposta NÃO for ok (status 2xx), tentamos ler um JSON de erro do backend
      // e lançamos uma exceção com uma mensagem amigável.
      if (!res.ok) {
        const body = await res.json().catch(() => null); // se não for JSON, ignora
        throw new Error(body?.erro || `Erro HTTP: ${res.status}`);
      }

      // Quando o backend responde 200/204 (ou similar) com o registro atualizado,
      // lemos o JSON e avisamos o componente pai para atualizar a lista local.
      const data = await res.json();
      onChamadoEstadoChange(data);
    } catch (err) {
      // Qualquer erro (rede, backend, parse de JSON, etc.) cai aqui.
      // Encaminhamos a mensagem para o pai mostrar (ex.: toast).
      setError(err?.message || 'Erro inesperado');
    }
  };

  // Abaixo está apenas a renderização do cartão do chamado (UI).
  return (
    <div>
      <div className="card m-2">
        <div className="card-header">
          Chamado <strong>#{chamado.id}</strong> Usuário{' '}
          <strong>#{chamado.Usuarios_id}</strong>
        </div>
        <div className="card-body">
          {/* Se houver imagem, tenta exibir; se der erro no carregamento, usa um fallback local */}
          {chamado.url_imagem && (
            <img
              className="me-2"
              width={40}
              src={chamado.url_imagem}
              onError={(e) =>
                (e.currentTarget.src = '/img/imagemErro404.png')
              }
            />
          )}
          <span>{chamado.texto}</span>
        </div>
        <div className="card-footer text-body-secondary">
          {/* Botão que alterna o estado do chamado.
              Ao clicar, dispara handleEstadoChange (PATCH). */}
          {chamado.estado === 'a' && (
            <button className="btn btn-success" onClick={handleEstadoChange}>
              Ativo
            </button>
          )}
          {chamado.estado === 'f' && (
            <button className="btn btn-secondary" onClick={handleEstadoChange}>
              Inativo
            </button>
          )}

          {/* Botões "Editar" e "Remover" estão presentes para futuras ações. */}
          <button className="btn btn-info mx-2 text-white">Editar</button>
          <button className="btn btn-danger">Remover</button>
        </div>
      </div>
    </div>
  );
};

export default Chamado;

