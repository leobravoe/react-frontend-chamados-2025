import Contador from "./Contador"
import Feed from "./Feed"
import FeedFiltravel from "./FeedFiltravel"
import NovoPost from "./NovoPost"
import Perfil from "./Perfil"
import Saudacao from "./Saudacao"

// src/App.jsx
const App = () => {
  return (
    <>
      <Perfil />
      <Saudacao nome="Ester" />
      <Contador />
      <Feed />
      <NovoPost />
      <FeedFiltravel />
    </>
  )
}
export default App