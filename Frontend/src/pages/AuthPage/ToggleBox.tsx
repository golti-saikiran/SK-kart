import { useNavigate } from "react-router";

type PropsType = {
    FormType: String,
    setActive: React.Dispatch<React.SetStateAction<boolean>>
}

const ToggleBox = (props: PropsType) => {
    const navigate = useNavigate()
    return (<>
        {props.FormType === "Register" ?
            <div className="toggle-panel toggle-left">
                <h2>Hello, Welcome!</h2>
                <p>Don't have an account?</p>
                <button className="btn register-btn" onClick={() => { props.setActive(true); navigate('/register')}}>Register</button>
            </div> :
            <div className="toggle-panel toggle-right">
                <h2> Welcome back!</h2>
                <p>Already have an account?</p>
                <button className="btn register-btn" onClick={() =>{ props.setActive(false); navigate('/login')}}>Login</button>
            </div>}
    </>
    )
}

export default ToggleBox
