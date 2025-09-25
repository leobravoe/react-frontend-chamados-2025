import Contador from "./Contador"
import Feed from "./Feed"
import NovoPost from "./NovoPost"
import Perfil from "./Perfil"
import Saudacao from "./Saudacao"

// src/App.jsx
const App = () => {
  return (
    <>
      <p>Olá, React!</p>
      <Perfil />
      <Saudacao nome="Ester" />
      <Contador />
      <Feed />
      <NovoPost />
    </>
  )
}
export default App