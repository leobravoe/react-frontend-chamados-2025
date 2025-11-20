const ChamadoShow = ({ chamado }) => {
    const Usuarios_id = chamado.Usuarios_id;
    const texto = chamado.texto;
    const estado = chamado.estado;
    const hasImagem = chamado.url_imagem ? true : false;

    return (
        <div className='m-2'>
            <div className='my-2'>
                <label htmlFor="id-input-id" className='form-label'>Usuarios_id</label>
                <input className="form-control" type="text" id="id-input-id" value={Usuarios_id} readOnly />
            </div>
            <div className='my-2'>
                <label htmlFor="id-input-texto" className='form-label'>Texto</label>
                <input className="form-control" type="text" id="id-input-texto" value={texto} readOnly />
            </div>
            <div className='my-2'>
                <label htmlFor="id-input-estado" className='form-label'>Estado</label>
                {estado === "a" && <input className="form-control" type="text" id="id-input-estado" value="Aberto" readOnly />}
                {estado === "f" && <input className="form-control" type="text" id="id-input-estado" value="Fechado" readOnly />}
            </div>
            <div className='my-2'>
                {hasImagem && (
                    <>
                        <div className='form-label d-block'>Imagem</div>
                        <div className='d-inline-flex gap-2'>
                            {chamado.url_imagem && (
                                <>
                                    <img
                                        src={chamado.url_imagem}
                                        alt={`Imagem do chamado ${chamado.id}`}
                                        onError={(e) => {
                                            // Para evitar loops infinitos caso a imagem de fallback também falhe
                                            e.target.onerror = null;
                                            // Define uma imagem de fallback
                                            e.target.src = "https://dummyimage.com/40x40/cccccc/000000.png&text=Error";
                                        }}
                                        className='border border-2 border-dark rounded-circle'
                                    />
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ChamadoShow