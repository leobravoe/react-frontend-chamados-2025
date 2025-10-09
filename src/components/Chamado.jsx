import React from 'react'

const Chamado = ({ chamado }) => {
    return (
        <div>
            {chamado.Usuarios_id} -
            {chamado.texto} -
            {chamado.estado} -
            {chamado.urlImagem}
            <div class="card text-center">
                <div class="card-header">
                    Featured
                </div>
                <div class="card-body">
                    <h5 class="card-title">Special title treatment</h5>
                    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                    <a href="#" class="btn btn-primary">Go somewhere</a>
                </div>
                <div class="card-footer text-body-secondary">
                    2 days ago
                </div>
            </div>
        </div>
    )
}

export default Chamado