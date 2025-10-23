import React from 'react'
import Navbar from '../../components/Navbar'
import ChamadoFormCreate from '../../components/ChamadoFormCreate'
import { Link } from 'react-router-dom'

const ChamadosCreate = () => {
  return (
    <div>
        <Navbar />
        <h1>ChamadosCreate.jsx</h1>
        <Link to="/chamados" className='btn btn-primary'>Voltar</Link>
        <ChamadoFormCreate />
    </div>
  )
}

export default ChamadosCreate