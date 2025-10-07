import { useEffect, useState } from 'react'

const ChamadosList = () => {
    // 1. Estados para guardar os dados, o status de carregamento e possíveis erros
    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Define função assíncrona para realizar a busca
        const fetchChamados = async () => {
            try {
                // A URL completa da nossa API
                const response = await fetch('http://localhost:3000/api/chamados');
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                const data = await response.json();
                setChamados(data); // Guarda os dados no estado
            } catch (err) {
                setError(err.message); // Guarda a mensagem de erro no estado
            } finally {
                setLoading(false); // Finaliza o carregamento, com sucesso ou erro
            }
        };
        fetchChamados(); // Executa a função
    }, []);

    if (loading) {
        return <p>Carregando chamados...</p>
    }
    if (error) {
        return <p>Erro ao buscar dados: {error}</p>
    }
    return (
        <div>
            {
                chamados.map(chamado =>
                    <p>
                        {chamado.usuarios_id} -
                        {chamado.texto} -
                        {chamado.estado}
                    </p>
                )
            }
        </div>
    )
}

export default ChamadosList