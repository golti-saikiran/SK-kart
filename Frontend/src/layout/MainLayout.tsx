import { Outlet } from "react-router"
import NavBar from "../components/NavBar/NavBar"
import Footer from "../components/Footer/Footer"


const MainLayout: React.FC = () => {

    return (
        <>
            <NavBar />
            <div style={{ minHeight: "73vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Outlet />
            </div>
            <Footer />
        </>
    )
}

export default MainLayout
