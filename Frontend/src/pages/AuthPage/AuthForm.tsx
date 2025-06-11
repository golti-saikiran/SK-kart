import { FaGoogle } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa6";
import { FaLinkedinIn, FaGithub, FaRegUser } from "react-icons/fa";
import { MdMailOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { useEffect, useState } from 'react'
import './LoginPage.css'
import {
    validateField,
    validateLoginForm,
    validateRegisterForm,
    registerFormType,
    LoginUser,
    RegisterUser
} from "./Validators";

import useStore from '../../Store/store'
import { toast } from "react-toastify";

export type AuthPropsType = {
    FormType: String
}


const AuthForm = ({ FormType }: AuthPropsType) => {

    const isLoginForm = FormType === 'Login'
    const updateUser = useStore(state => state.updateUser);
    const setIsAuthenticate = useStore(state => state.setIsAuthenticate);
    

    const [showPassword, setShowPassword] = useState(false)
    const [apiError, setApiError] = useState('')
    const [formMessage, setFormMessage] = useState('')
    // const [isFormError, setIsFormError] = useState(false)
    // const [isFormSuccess, setIsFormSuccess] = useState(false)
    const [isFormValid, setIsFormValid] = useState(false);
    const [userData, setUserData] = useState({
        name: "",
        password: "",
        email: "",
        confirmpassword: ""
    })
    const [errors, setErrors] = useState({
        name: "",
        password: "",
        email: "",
        confirmpassword: "",
    })


    useEffect(() => {
        isLoginForm ? validateLoginForm(userData, setIsFormValid) : validateRegisterForm(userData, setIsFormValid)
    }, [userData])

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        })
        validateField(name as keyof registerFormType, value, setErrors, isLoginForm, userData);
    }


    const HandleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({
            name: "",
            password: "",
            email: "",
            confirmpassword: "",
        })
        setApiError('')
        setFormMessage('')
        if (isFormValid) {
            try {
                const responseData = isLoginForm ?
                    await LoginUser({
                        email: userData.email,
                        password: userData.password
                    }) :
                    await RegisterUser(userData);
                updateUser(responseData?.data?.user)
                if (responseData.data.token) {
                    localStorage.setItem('token', responseData.data.token);
                    setIsAuthenticate(true)
                    toast("Logged in")
                }
                if (responseData.data.success) {
                    setFormMessage(responseData.data.message)
                    setUserData({
                        name: "",
                        password: "",
                        email: "",
                        confirmpassword: ""
                    })
                } else {
                    setApiError(responseData?.data?.message)
                }
            }
            catch (err: any) {
                setApiError(err?.data?.message)
            }
        }
    };
    const errorMessage = apiError ? apiError :
        errors.name ? errors.name :
            errors.email ? errors.email :
                errors.password ? errors.password :
                    errors.confirmpassword ? errors.confirmpassword : "";

    return (
        <div className={isLoginForm ? "form-box login" : "form-box register"}>
            <form className="signup-form">
                <h2 className="form-heading">{isLoginForm ? "Login" : "Register"}</h2>
                {isLoginForm ? <></> :
                    <>
                        <div className="form-input">
                            <input
                                type="text"
                                name="name"
                                value={userData.name}
                                onChange={(e) => handleInputChange(e)}
                                className="input-field"
                                placeholder="Name" />
                            <FaRegUser className="form-icons" />
                        </div>
                    </>
                }
                <div className="form-input">
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={(e) => handleInputChange(e)}
                        className="input-field"
                        placeholder="Email" />
                    <MdMailOutline className="form-icons" />
                </div>
                <div className="form-input">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={userData.password}
                        onChange={(e) => handleInputChange(e)}
                        className="input-field"
                        placeholder="Password" />
                    {showPassword ?
                        <FaRegEye className="form-icons password" onClick={() => setShowPassword((prev) => !prev)} /> :
                        <FaRegEyeSlash className="form-icons password" onClick={() => setShowPassword((prev) => !prev)} />
                    }
                </div>
                {isLoginForm ? <></> :
                    <>
                        <div className="form-input">
                            <input
                                type={"password"}
                                name="confirmpassword"
                                value={userData.confirmpassword}
                                onChange={(e) => handleInputChange(e)}
                                className="input-field"
                                placeholder="Confirm password" />
                            <RiLockPasswordLine className="form-icons password" />
                        </div>
                    </>
                }
                {isLoginForm ? <a href="/forgot-password" className="forgot-password">Forgot Password?</a> : <></>}
                <button className="btn" onClick={(e) => HandleSubmit(e)} disabled={!isFormValid}>{isLoginForm ? "Login" : "Register"}</button>
                {errorMessage && <p className="error message">{errorMessage}</p>}
                {/* {isFormError && <p className="error message">{formMessage && formMessage}</p>} */}
                {formMessage && <p className="success message">{formMessage}</p>}
                <p>or {isLoginForm ? "Login" : "Register"} with social platforms</p>
                <div className="social-icons">
                    <a href="#"><FaGoogle /></a>
                    <a href="#"><FaFacebookF /></a>
                    <a href="#"><FaGithub /></a>
                    <a href="#"><FaLinkedinIn /></a>
                </div>
            </form>
        </div>
    )
}

export default AuthForm
