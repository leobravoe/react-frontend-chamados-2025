import React from 'react'

const Chamado = ({ chamado }) => {
    return (
        <div>
            {chamado.Usuarios_id} -
            {chamado.texto} -
            {chamado.estado} -
            {chamado.urlImagem}
        </div>
    )
}

export default Chamado