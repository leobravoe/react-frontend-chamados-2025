import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
/**
 * Componente de formulário para criar um novo chamado.
 * Ele gerencia o estado do formulário, a submissão e a navegação.
 */
const ChamadoFormCreate = () => {
    // Estado para armazenar o ID do usuário. Inicializado com "1" (pode ser ajustado para um valor dinâmico).
    const [Usuarios_id, setUsuariosId] = useState("1");
    // Estado para armazenar o texto/descrição do chamado.
    const [texto, setTexto] = useState("");
    // Estado para armazenar o estado do chamado ('a' para Ativo, 'f' para Fechado).
    const [estado, setEstado] = useState("a");
    // Estado para armazenar o arquivo de imagem selecionado (File) para envio via multipart/form-data.
    const [imagem, setImagem] = useState(null);
    // Estado para armazenar qualquer erro que ocorra durante a submissão.
    const [error, setError] = useState(null);
    // Hook para navegação programática (redirecionamento) após a submissão.
    const navigate = useNavigate();
    /**
     * Função assíncrona que é chamada quando o formulário é submetido.
     * @param {Event} e - O evento de submissão do formulário.
     */
    const handleSubmit = async (e) => {
        // Previne o comportamento padrão de recarregar a página.
        e.preventDefault();
        
        // Constrói o corpo multipart/form-data para enviar campos + arquivo (imagem).
        const fd = new FormData();
        fd.append('Usuarios_id', Usuarios_id); // Atributo: valor do estado "Usuarios_id"
        fd.append('texto', texto);             // Atributo: valor do estado "texto"
        fd.append('estado', estado);           // Atributo: valor do estado "estado"
        if (imagem) {
            fd.append('imagem', imagem);       // Atributo de arquivo: campo "imagem" esperado pelo backend
        }
        
        // Inicia o bloco try-catch para lidar com a chamada da API e possíveis erros.
        try {
            // Faz a requisição POST para a API usando multipart/form-data (não defina Content-Type manualmente).
            const response = await fetch("http://localhost:3000/api/chamados", {
                method: 'POST',
                body: fd
            });
            
            // Verifica se a resposta da requisição não foi bem-sucedida (status 4xx ou 5xx).
            if (!response.ok) {
                // Tenta ler o corpo da resposta como JSON para obter detalhes do erro da API.
                const errorData = await response.json().catch(() => null);
                
                // Constrói uma mensagem de erro detalhada.
                const errorMessage = errorData?.erro ?
                    `Erro HTTP: STATUS ${response.status} ${errorData?.erro} ${response.statusText}` :
                    `Erro HTTP: STATUS ${response.status} ${response.statusText}`;
                    
                // Lança um erro para ser capturado pelo bloco catch.
                throw new Error(errorMessage);
            }
            
            // Se a requisição for bem-sucedida, redireciona o usuário para a lista de chamados.
            navigate("/chamados");
            
        } catch (err) {
            // Se ocorrer um erro (de rede ou da API), define a mensagem de erro no estado.
            setError(err.message);
        }
    }
    // ----------------------------------------------------
    // RENDERIZAÇÃO
    // ----------------------------------------------------
    
    return (
        // Formulário HTML, com a função handleSubmit ligada ao evento de submissão.
        // Usa "multipart/form-data" para permitir envio de arquivo.
        <form onSubmit={handleSubmit} className='m-2' encType="multipart/form-data">
            {/* Renderização condicional do Toast de erro.
              Exibe um toast (usando classes de estilo Bootstrap) se houver um erro no estado.
            */}
            {error && <div class="toast-container position-fixed bottom-0 end-0 p-3">
                <div class="toast text-bg-danger bg-opacity-50 show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                        <strong class="me-auto">Erro</strong>
                        {/* Botão para fechar o toast de erro, limpando o estado `error`. */}
                        <button
                            type="button"
                            class="btn-close"
                            aria-label="Close"
                            onClick={() => setError(null)}
                        >
                        </button>
                    </div>
                    <div class="toast-body">
                        {error} {/* Exibe a mensagem de erro */}
                    </div>
                </div>
            </div>}
            
            {/* Campo de input para o ID do Usuário */}
            <div className='my-2'>
                <label className='form-label' htmlFor="id-input-Usuarios_id">Usuarios_id</label>
                <input
                    className='form-control'
                    type="number"
                    id="id-input-Usuarios_id"
                    value={Usuarios_id}
                    // Atualiza o estado `Usuarios_id` sempre que o valor do input muda.
                    onChange={(e) => setUsuariosId(e.target.value)}
                />
            </div>
            
            {/* Campo de input para o Texto/Descrição do chamado */}
            <div className='my-2'>
                <label className='form-label' htmlFor="id-input-texto">texto</label>
                <input
                    className='form-control'
                    type="text"
                    id="id-input-texto"
                    value={texto}
                    // Atualiza o estado `texto`.
                    onChange={(e) => setTexto(e.target.value)}
                />
            </div>
            
            {/* Campo de seleção (Select) para o Estado do chamado */}
            <div className='my-2'>
                <label className='form-label' htmlFor="id-input-estado">estado</label>
                <select
                    className='form-select'
                    // Atualiza o estado `estado` com o valor da opção selecionada.
                    onChange={(e) => setEstado(e.target.value)}
                >
                    <option value="a">Ativo</option>
                    <option value="f">Fechado</option>
                </select>
            </div>
            
            {/* Campo de input para selecionar a imagem (arquivo) */}
            <div className='my-2'>
                <label className='form-label' htmlFor="id-input-imagem">imagem</label>
                <input
                    className='form-control'
                    type="file"
                    id="id-input-imagem"
                    accept="image/*"
                    // Atualiza o estado `imagem` com o arquivo selecionado.
                    onChange={(e) => setImagem(e.target.files?.[0] ?? null)}
                />
            </div>
            
            {/* Botão de submissão do formulário */}
            <div className='my-2'>
                <button type='submit' className='btn btn-primary'>Enviar</button>
            </div>
        </form>
    )
}
// Exporta o componente para que possa ser usado em outras partes da aplicação.
export default ChamadoFormCreate