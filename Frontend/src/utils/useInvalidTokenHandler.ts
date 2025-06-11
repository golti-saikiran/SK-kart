import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useStore from "../Store/store";
import { useCallback } from "react";

const useInvalidTokenHandler = () => {
    const setIsAuthenticate = useStore((state) => state.setIsAuthenticate);
    const navigate = useNavigate();

    return useCallback((message: string) => {
        console.log(message);

        if (message === "Token expired" || message === "Invalid token") {
            toast.error("Session expired, please login again...");
            setIsAuthenticate(false);
            localStorage.removeItem("token");
            localStorage.removeItem("app-store-storage");
            navigate("/login");
        }
    }, [navigate, setIsAuthenticate]);
};

export default useInvalidTokenHandler;
