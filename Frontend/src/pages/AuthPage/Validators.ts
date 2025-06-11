import * as Yup from 'yup'
import axios from 'axios'
import { endpoints, base_backend_url } from "../../utils/EndPoints";

export type registerFormType = {
    password: String,
    name: String,
    email?: String,
    confirmpassword: String
}

export type loginFormType = {
    password: String,
    email: String
}

export const RegisterSchema: Yup.ObjectSchema<registerFormType> = Yup.object({
    name: Yup.string()
        .required("name must required"),
    password: Yup.string()
        .required("password must required")
        .min(8, "password must be minimum 8 characters")
        .matches(/[!@#$%^&*(),.?":{}|<>]/, "password must contain atlest one charater")
        .matches(/[0-9]/, "password must contain atlest one nummber")
        .matches(/[A-Z]/, "password must contain atlest one uppercase letter")
        .matches(/[a-z]/, "password must contain atlest one lowercase letter"),
    email: Yup.string()
        .required("email must required")
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Enter valid email"),
    confirmpassword: Yup.string()
        .oneOf([Yup.ref("password")], "passwords must match")
        .required("confirm password is required"),

})


export const loginSchema: Yup.ObjectSchema<loginFormType> = Yup.object({
    email: Yup.string().required('email is required'),
    password: Yup.string().required('Password is required'),
});

export const validateField = async (fieldName: keyof registerFormType,
    value: string, setErrors: React.Dispatch<React.SetStateAction<{
        name: string;
        password: string;
        email: string;
        confirmpassword: string;
    }>>, isLoginForm: Boolean,
    userData: registerFormType) => {
    try {
        if (isLoginForm) {
            await loginSchema.validateAt(fieldName, { [fieldName]: value })
            setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: '' }))
        } else {
            await RegisterSchema.validateAt(fieldName, {
                ...userData,
                [fieldName]: value
            });
            setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: '' }));
        }
    } catch (error) {
        if (error instanceof Yup.ValidationError) {
            setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: error.message })); // Set error
        }
    }
};

export const validateRegisterForm = async (userData: registerFormType,
    setIsFormValid: React.Dispatch<React.SetStateAction<boolean>>) => {
    try {
        await RegisterSchema.validate(userData, { abortEarly: false });
        setIsFormValid(true)
    } catch (error) {
        setIsFormValid(false)
    }
};

export const validateLoginForm = async (userData: registerFormType,
    setIsFormValid: React.Dispatch<React.SetStateAction<boolean>>) => {
    try {
        await loginSchema.validate(userData, { abortEarly: false });
        setIsFormValid(true)
    } catch (error) {
        setIsFormValid(false)
    }
};

export const RegisterUser = async (userData: registerFormType) => {
    try {
        const url = `${base_backend_url}${endpoints.users.registerUser}`
        const responseData = await axios.post(url, userData)
        return responseData
    } catch (err: any) {
        return err.response
    }
}

export const LoginUser = async (LoginuserData: loginFormType) => {
    try {
        const url = `${base_backend_url}${endpoints.users.loginUser}`
        const responseData = await axios.post(url, LoginuserData)
        return responseData
    } catch (err: any) {
        return err.response
    }
}


