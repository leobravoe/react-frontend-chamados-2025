import React, { useState } from 'react'

const ChamadoFormCreate = () => {
    const [Usuarios_id, setUsuariosId] = useState("1");
    const [texto, setTexto] = useState("");
    const [estado, setEstado] = useState("a");
    const [url_imagem, setUrlImagem] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Função chamada");
    }

    return (
        <form onSubmit={handleSubmit} className='m-2'>
            <div className='my-2'>
                <label className='form-label' htmlFor="id-input-Usuarios_id">Usuarios_id</label>
                <input
                    className='form-control'
                    type="text"
                    id="id-input-Usuarios_id"
                    value={Usuarios_id}
                    onChange={(e) => setUsuariosId(e.target.value)}
                />
            </div>
            <div className='my-2'>
                <label className='form-label' htmlFor="id-input-texto">texto</label>
                <input
                    className='form-control'
                    type="text"
                    id="id-input-texto"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                />
            </div>
            <div className='my-2'>
                <label className='form-label' htmlFor="id-input-estado">estado</label>
                <input
                    className='form-control'
                    type="text"
                    id="id-input-estado"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                />
            </div>
            <div className='my-2'>
                <label className='form-label' htmlFor="id-input-url_imagem">url_imagem</label>
                <input
                    className='form-control'
                    type="text"
                    id="id-input-url_imagem"
                    value={url_imagem}
                    onChange={(e) => setUrlImagem(e.target.value)}
                />
            </div>
            <div className='my-2'>
                <button type='submit' className='btn btn-primary'>Enviar</button>
            </div>
        </form>
    )
}

export default ChamadoFormCreate