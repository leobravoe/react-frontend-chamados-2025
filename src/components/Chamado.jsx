const Chamado = ({ chamado }) => {
    const handleEstadoChange = async () => {
        const response = await fetch(`http://localhost:3000/api/chamados/${chamado.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estado: chamado.estado === "a" ? "f" : "a" }),
        });
    }
    return (
        <div>
            <div className="card m-2">
                <div className="card-header">
                    Chamado <strong>#{chamado.id}</strong> Usuário <strong>#{chamado.Usuarios_id}</strong>
                </div>
                <div className="card-body">
                    {chamado.url_imagem && <img className="me-2" width={40} src={chamado.url_imagem} onError={
                        (e) => e.currentTarget.src = "/img/imagemErro404.png"
                    } />}
                    <span>{chamado.texto}</span>
                </div>
                <div className="card-footer text-body-secondary">
                    {chamado.estado === "a" && <button className="btn btn-success" onClick={handleEstadoChange}>Ativo</button>}
                    {chamado.estado === "f" && <button className="btn btn-secondary" onClick={handleEstadoChange}>Inativo</button>}
                    <button className="btn btn-info mx-2 text-white">Editar</button>
                    <button className="btn btn-danger">Remover</button>
                </div>
            </div>
        </div>
    )
}
export default Chamado