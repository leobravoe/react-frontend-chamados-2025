import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import ChamadoEditForm from '../../components/ChamadoEditForm';
import { Link, useParams } from 'react-router-dom';
import { useAuthFetch } from '../../hooks/useAuthFetch';

const ChamadosEdit = () => {
    // Pega o 'id' da URL, como você já fez.
    const { id } = useParams();

    // Estados para controlar os dados, o carregamento e possíveis erros.
    const [chamadoData, setChamadoData] = useState(null); // Armazena os dados do chamado
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const authFetch = useAuthFetch();

    // useEffect para buscar os dados da API quando o componente for montado ou o 'id' mudar.
    useEffect(() => {
        // Função async para realizar a busca
        const fetchChamadoById = async () => {
            // Reinicia os estados antes de uma nova busca
            setLoading(true);
            setError(null);

            try {
                const response = await authFetch(`http://localhost:3000/api/chamados/${id}`);

                if (!response.ok) {
                    throw new Error('Não foi possível carregar os dados do chamado.');
                }

                const data = await response.json();
                setChamadoData(data); // Salva os dados no estado

            } catch (err) {
                setError(err.message); // Salva a mensagem de erro no estado

            } finally {
                setLoading(false); // Finaliza o carregamento, com sucesso ou erro
            }
        };

        fetchChamadoById();
    }, [id]); // O array de dependências [id] garante que a busca será refeita se o id mudar

    // Renderização condicional com base no estado da busca
    const renderContent = () => {
        if (loading) {
            return <p>Carregando formulário...</p>;
        }

        if (error) {
            return <p style={{ color: 'red' }}>Erro: {error}</p>;
        }

        // Se não está carregando e não há erro, e os dados existem, renderiza o formulário
        if (chamadoData) {
            // Passamos os dados buscados como uma prop para o formulário
            return <ChamadoEditForm chamado={chamadoData} />;
        }

        return null; // Ou uma mensagem de "Nenhum dado encontrado"
    };

    return (
        <div>
            <Navbar />
            <h1 className='mx-2'>ChamadosEdit.jsx</h1>
            <Link to="/chamados" className="btn btn-primary mx-2">Voltar</Link>
            {renderContent()}
        </div>
    );
};

export default ChamadosEdit;