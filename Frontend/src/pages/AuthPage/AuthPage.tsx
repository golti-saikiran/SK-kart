import { useEffect, useState } from "react";
import './LoginPage.css'
import AuthForm from "./AuthForm";
import ToggleBox from "./ToggleBox";
import useAuthStore from "../../Store/store";
import { useNavigate } from "react-router";

const AuthPage = () => {
  const isRegister = window.location.pathname === '/login' ? false : true;
  const navigate = useNavigate()

  const [active, setActive] = useState(isRegister)
  const isAuthenticate = useAuthStore(state => state.isAuthenticate);
  useEffect(() => {
    if (isAuthenticate) navigate('/');
  }, [isAuthenticate, navigate]);

  useEffect(() => {
    setActive(location.pathname !== '/login');
  }, [location.pathname]);


  const FormType = {
    Login: "Login",
    Register: "Register"
  }
  return (
    <>
      {!isAuthenticate &&
        <div className={active ? "container active" : "container"}>
          <AuthForm
            FormType={FormType.Login} />
          <AuthForm
            FormType={FormType.Register} />
          <div className="toggle-box">
            <ToggleBox
              FormType={FormType.Register}
              setActive={setActive}
            />
            <ToggleBox
              FormType={FormType.Login}
              setActive={setActive}
            />
          </div>
        </div>
      }
    </>
  )
}

export default AuthPage
