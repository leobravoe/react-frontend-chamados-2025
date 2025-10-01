import BootstrapTest from "../components/BootstrapTest"
import Contador from "../components/Contador"
import Feed from "../components/Feed"
import FeedFiltravel from "../components/FeedFiltravel"
import NovoPost from "../components/NovoPost"
import Perfil from "../components/Perfil"
import Saudacao from "../components/Saudacao"

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
      <BootstrapTest />
    </>
  )
}
export default App