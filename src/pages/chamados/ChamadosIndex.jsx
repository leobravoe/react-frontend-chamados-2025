import React from 'react'
import Navbar from '../../components/Navbar'
import ChamadosList from '../../components/ChamadosList'
import { Link } from 'react-router-dom'

const ChamadosIndex = () => {
  return (
    <div>
        <Navbar />
        <h1>ChamadosIndex.jsx</h1>
        <Link to="/chamados/create" className='btn btn-primary'>Criar chamado</Link>
        <ChamadosList />
    </div>
  )
}

export default ChamadosIndex