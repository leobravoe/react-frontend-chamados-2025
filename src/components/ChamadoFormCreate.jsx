import React from 'react'

const ChamadoFormCreate = () => {

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Função chamada");
    }

    return (
        <form onSubmit={handleSubmit} className='m-2'>
            <div className='my-2'>
                <label className='form-label' htmlFor="id-input-Usuarios_id">Usuarios_id</label>
                <input className='form-control' type="text" id="id-input-Usuarios_id" />
            </div>
            <div className='my-2'>
                <label className='form-label' htmlFor="id-input-Usuarios_id">Usuarios_id</label>
                <input className='form-control' type="text" id="id-input-Usuarios_id" />
            </div>
            <div className='my-2'>
                <label className='form-label' htmlFor="id-input-Usuarios_id">Usuarios_id</label>
                <input className='form-control' type="text" id="id-input-Usuarios_id" />
            </div>
            <div className='my-2'>
                <label className='form-label' htmlFor="id-input-Usuarios_id">Usuarios_id</label>
                <input className='form-control' type="text" id="id-input-Usuarios_id" />
            </div>
            <button>Sem tipo</button>
            <button type='button'>Tipo button</button>
            <button type='reset'>Tipo reset</button>
            <button type='submit' className='btn btn-primary'>Enviar</button>
        </form>
    )
}

export default ChamadoFormCreate