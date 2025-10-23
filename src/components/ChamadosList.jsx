// src/components/ChamadosList.jsx
import { useState, useEffect } from 'react';
import Chamado from './Chamado';
// ChamadosList com cache no localStorage
const ChamadosList = () => {
    // Pega o cache do LocalStorage, caso não encontre recebe null
    const chamadosCache = JSON.parse(localStorage.getItem('chamadosCache'));
    // 1. Estados para guardar os dados, o status de carregamento e possíveis erros
    const [chamados, setChamados] = useState(chamadosCache ?? []);
    const [loading, setLoading] = useState(chamadosCache ? false : true);
    const [error, setError] = useState(null);
    // 2. O useEffect para buscar os dados
    useEffect(() => {
        // Cria um AbortController para gerenciar a requisição
        const abortController = new AbortController();
        // Define função assíncrona para realizar a busca
        const fetchChamados = async () => {
            try {
                // A URL completa da nossa API, agora com o sinal do controller
                const response = await fetch('http://localhost:3000/api/chamados', {
                    signal: abortController.signal
                });
                // Se houver erro na resposta
                if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
                // Se não houver atualização nos dados
                if (response.status == 304) return;
                const data = await response.json(); // Converte para JSON
                setChamados(data); // Guarda os dados no estado
                setError(null);    // Limpa algum erro
                localStorage.setItem('chamadosCache', JSON.stringify(data)); // Guarda no localStorage
            } catch (err) {
                setError(err.message); // Seta o estado de erro
            } finally {
                setLoading(false); // Finaliza o carregamento, com sucesso, erro ou cancelamento
            }
        };
        // Caso não haja cache armazenado
        if (!chamadosCache)
            fetchChamados(); // Executa a função a primeira vez
        // A cada 5 segundos fetchChamados() será chamada
        const interval5secs = setInterval(() => {
            fetchChamados(); // Executa a função de tempos em tempos
        }, 5000);
        // 3. A função de limpeza do useEffect.
        //    Será chamada quando o componente for desmontado.
        return () => {
            abortController.abort(); // Cancela a requisição fetch em andamento
            clearInterval(interval5secs);
        };
    }, []); // O array de dependências vazio garante que o efeito rode apenas uma vez
    // 4. Renderização condicional do componente
    if (loading) {
        return <p>Carregando chamados...</p>;
    }
    // 5. Renderização do componente
    return (
        <div>
            <h1>Lista de Chamados</h1>
            {error && <div class="toast-container position-fixed bottom-0 end-0 p-3">
                <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                        <strong class="me-auto">Erro</strong>
                        <button
                            type="button"
                            class="btn-close"
                            aria-label="Close"
                            onClick={() => setError(null)}
                        >
                        </button>
                    </div>
                    <div class="toast-body">
                        {error}
                    </div>
                </div>
            </div>}
            <div>
                {chamados.map((chamado) => (
                    <Chamado key={chamado.id} chamado={chamado} />
                ))}
            </div>
        </div>
    );
};
export default ChamadosList;
