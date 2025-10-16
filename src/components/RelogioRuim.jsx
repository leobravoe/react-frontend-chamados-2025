import React from 'react'

const RelogioRuim = () => {
    const [tick, setTick] = React.useState(0);
    React.useEffect(() => {
        // A cada render, um NOVO interval é criado, sem limpar o anterior.
        setInterval(() => setTick(tick + 1), 1000);
        // ❌ SEM CLEANUP!
    }); // ❌ Sem dependências, roda a cada render!
    return <p>tick: {tick}</p>; // O contador vai acelerar loucamente.
}

export default RelogioRuim