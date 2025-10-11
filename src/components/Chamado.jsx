import React from 'react'

const Chamado = ({ chamado }) => {
    return (
        <div>
            <div className="card m-2">
                <div className="card-header">
                    Chamado <strong>#{chamado.id}</strong> Usuário <strong>#{chamado.Usuarios_id}</strong>
                </div>
                <div className="card-body">
                    <img className="me-2" width={40} src={chamado.urlImagem} onError={
                        (e) => e.currentTarget.src = "/img/imagemErro404.png"
                    } />
                    <span>{chamado.texto}</span>
                </div>
                <div className="card-footer text-body-secondary">
                    {chamado.estado === "a" && <button className="btn btn-success">Ativo</button>}
                    {chamado.estado === "f" && <button className="btn btn-secondary">Inativo</button>}
                    <button className="btn btn-info mx-2 text-white">Editar</button>
                    <button className="btn btn-danger">Remover</button>
                </div>
            </div>
        </div>
    )
}

export default Chamado