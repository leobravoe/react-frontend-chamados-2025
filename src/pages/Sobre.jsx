import Navbar from "../components/Navbar"
import RelogioOk from "../components/RelogioOk"
import RelogioRuim from "../components/RelogioRuim"

const Sobre = () => {
    return (
        <div>
            <Navbar />
            <h1 className="mx-2">Sobre.jsx</h1>
            <div className="mx-2">
                <RelogioRuim />
                <RelogioOk />
            </div>
        </div>
    )
}
export default Sobre