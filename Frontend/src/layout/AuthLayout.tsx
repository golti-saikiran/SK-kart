import { Outlet, useNavigate } from "react-router"
import useAuthStore from "../Store/store";
import { toast } from "react-toastify";


const AuthLayout = () => {
    const navigate = useNavigate()
    const isAuthenticate = useAuthStore(state => state.isAuthenticate);
    if (!isAuthenticate) {
        toast.warn("Please login to continue")
        navigate('/login')
    }

    return (
        <>
            {isAuthenticate && <Outlet />}
        </>
    )
}

export default AuthLayout
