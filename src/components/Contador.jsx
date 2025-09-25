import { useState } from 'react'

const Contador = () => {
    const [valor, setValor] = useState(0);
    return (
        <div>
            <button type="button" onClick={() => setValor(v => v - 1)}>-</button>
            <span>{valor}</span>
            <button type="button" onClick={() => setValor(v => v + 1)}>+</button>
        </div>
    )
}

export default Contador