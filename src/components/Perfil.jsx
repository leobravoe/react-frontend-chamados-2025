const Perfil = () => {
    const nome = "Leonardo Bravo Estácio";
    const imgUrl = "https://www.freeiconspng.com/uploads/profile-icon-9.png";
    const descricao = "Desenvolvedor e professor. Apaixonado por React.";
    return (
        <div>
            <h1>{nome}</h1>
            <img src={imgUrl} width={100} />
            <p>{descricao}</p>
        </div>
    )
}
export default Perfil