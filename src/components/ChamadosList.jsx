// src/components/ChamadosList.jsx
//
// OBJETIVO
// -----------------------------------------------------------------------------
// Este componente busca periodicamente a lista de "chamados" no backend,
// guarda um cache no localStorage, mostra erros em um toast simples e
// renderiza cada item usando o componente <Chamado />.
//
// -----------------------------------------------------------------------------
// - useState: cria estados reativos para dados (chamados), loading e erro.
// - useEffect: executa efeitos colaterais (ex.: buscar dados ao montar).
// - AbortController: permite cancelar uma requisição fetch se o componente
//   for desmontado (evita "state update on unmounted component").
// - useAuthFetch: helper baseado em fetch que já:
//     * Anexa Authorization: Bearer <access_token> (se existir em sessionStorage);
//     * Envia cookies (refresh HttpOnly);
//     * Tenta renovar o access token automaticamente quando a API responder 401;
//     * Refaz a requisição original uma única vez após o refresh.
// - localStorage: salva um "cache" da última lista para renderizar rápido
//   (mesmo antes de a nova busca terminar).

import { useState, useEffect } from 'react';
import Chamado from './Chamado';
import { useAuthFetch } from '../hooks/useAuthFetch';

const ChamadosList = () => {
    // Tenta ler um cache previamente salvo (ou null se não houver).
    const chamadosCache = JSON.parse(localStorage.getItem('chamadosCache'));

    // Estados da tela:
    // - chamados: a lista vinda da API (ou o cache inicial).
    // - loading: exibe "Carregando..." enquanto a primeira busca acontece.
    // - error: mensagem de erro para o toast (string ou null).
    const [chamados, setChamados] = useState(chamadosCache ?? []);
    const [loading, setLoading] = useState(chamadosCache ? false : true);
    const [error, setError] = useState(null);

    // Pega a função de busca autenticada (cuida de Bearer + refresh automático).
    const authFetch = useAuthFetch();

    useEffect(() => {
        // Controlador para permitir cancelar a(s) requisição(ões) se o componente desmontar.
        const abortController = new AbortController();

        // Função que efetivamente busca a lista na API.
        const fetchChamados = async () => {
            try {
                // Faz GET usando o helper; passamos o signal do AbortController.
                const res = await authFetch('http://localhost:3000/api/chamados', {
                    method: 'GET',
                    signal: abortController.signal,
                });

                // Se não for 2xx, geramos um erro para cair no catch.
                if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);

                // Se o servidor respondeu 304 (sem mudanças), não atualiza estado/localStorage.
                if (res.status === 304) return;

                // Lê o corpo como JSON e atualiza a lista e o cache.
                const data = await res.json();
                setChamados(data);
                localStorage.setItem('chamadosCache', JSON.stringify(data));
            } catch (err) {
                // Se o erro veio de um abort() (usuário saiu da tela, por ex.), apenas ignore.
                if (err?.name === 'AbortError') return;

                // Para qualquer outro erro, mostramos no toast.
                setError(err.message);
            } finally {
                // Após a primeira tentativa (com sucesso ou erro), desliga o "Carregando...".
                setLoading(false);
            }
        };

        // 1ª carga imediatamente ao montar.
        fetchChamados();

        // Atualiza a lista a cada 5s. Útil para "quase tempo real".
        const interval5secs = setInterval(fetchChamados, 5000);

        // Limpeza do efeito:
        // - Cancela qualquer requisição em andamento;
        // - Para o intervalo de atualizações.
        return () => {
            abortController.abort();
            clearInterval(interval5secs);
        };
    }, []); // [] = executa o efeito apenas uma vez, ao montar o componente.

    // Callback chamado pelo filho <Chamado /> quando um item foi atualizado no backend.
    // Substitui o item correspondente na lista local (mantém os demais).
    const onChamadoEstadoChange = (chamadoAlterado) => {
        const newChamados = chamados.map((ch) =>
            ch.id == chamadoAlterado.id ? chamadoAlterado : ch
        );
        setChamados(newChamados);
    };

    const onChamadoDelete = (chamadoDeletadoId) => {
        const newChamados = chamados.filter((ch) =>
            ch.id != chamadoDeletadoId
        );
        setChamados(newChamados);
    };

    // Enquanto estiver carregando a primeira busca, mostra um placeholder simples.
    if (loading) {
        return <p>Carregando chamados...</p>;
    }

    // Renderização principal:
    // - Se existir "error", renderiza um toast (usa classes de estilo do Bootstrap).
    // - Mapeia a lista e renderiza um <Chamado /> por item.
    return (
        <div>
            {error && <div className="toast-container position-fixed bottom-0 end-0 p-3">
                <div className="toast text-bg-danger bg-opacity-50 show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="toast-header">
                        <strong className="me-auto">Erro</strong>
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
            <div>
                {chamados.map((chamado) => (
                    <Chamado
                        key={chamado.id}
                        chamado={chamado}
                        setError={setError}
                        onChamadoEstadoChange={onChamadoEstadoChange}
                        onChamadoDelete={onChamadoDelete}
                    />
                ))}
            </div>
        </div>
    );
};

export default ChamadosList;