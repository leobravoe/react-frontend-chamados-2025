import React from 'react'

const RelogioOk = () => {
    const [tick, setTick] = React.useState(0);
    React.useEffect(() => {
        const id = setInterval(() => {
            // Usando a forma funcional do setState para não depender do 'tick' externo.
            setTick(t => t + 1);
        }, 1000);
        // A função de cleanup é retornada aqui!
        return () => clearInterval(id);
    }, []); // Roda apenas uma vez, criando um único interval.
    return <p>tick: {tick}</p>;

}

export default RelogioOk