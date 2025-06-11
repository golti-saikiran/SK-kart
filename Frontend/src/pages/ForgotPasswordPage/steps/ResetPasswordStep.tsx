import { useState } from "react";
import * as yup from "yup";
import axios from "axios";
import { endpoints, base_backend_url } from "../../../utils/EndPoints";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

interface ResetPasswordStepProps {
    onNext: () => void;
    email: string
}

const schema = yup.object().shape({
    newPassword: yup.string().min(6, "Password must be at least 6 characters").required("New password is required"),
    confirmNewPassword: yup
        .string()
        .oneOf([yup.ref("newPassword"), undefined], "Passwords must match")
        .required("Confirm password is required"),
});

const ResetPasswordStep: React.FC<ResetPasswordStepProps> = ({ onNext, email }) => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [errors, setErrors] = useState<{ newPassword?: string; confirmNewPassword?: string, apiError?: string }>({});
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false)

    const validateAndSubmit = async () => {
        try {
            await schema.validate({ newPassword, confirmNewPassword }, { abortEarly: false });
            setErrors({});
            setLoading(true);
            const url = `${base_backend_url}${endpoints.users.resetPassword}`
            await axios.post(url, { email, password: newPassword });
            toast.success("Password reset successful!");
            setIsSuccess(true)
            setNewPassword('')
            setConfirmNewPassword('')
            onNext()

        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const newErrors: any = {};
                error.inner.forEach((err) => {
                    if (err.path) newErrors[err.path] = err.message;
                });
                setErrors(newErrors);
            } else {
                console.error("Error resetting password:", error);
                setErrors({
                    ...errors,
                    apiError: "Failed to reset password. Please try again."
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const errorMessage = errors.apiError ? errors.apiError :
        errors.newPassword ? errors.newPassword : errors.confirmNewPassword

    return (<>
        {isSuccess ? "Password reset Successful, Now you can login with new password" :
            <div className="emailstep-container">
                <div className="input-container">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password"
                    />
                    {showPassword ?
                        <FaRegEye className="setPassword-icon" onClick={() => setShowPassword((prev) => !prev)} /> :
                        <FaRegEyeSlash className="setPassword-icon" onClick={() => setShowPassword((prev) => !prev)} />
                    }
                </div>

                <div className="input-container">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Confirm Password"
                    />
                    {showConfirmPassword ?
                        <FaRegEye className="setPassword-icon" onClick={() => setShowConfirmPassword((prev) => !prev)} /> :
                        <FaRegEyeSlash className="setPassword-icon" onClick={() => setShowConfirmPassword((prev) => !prev)} />
                    }
                </div>

                {errorMessage && <p className="error message">{errorMessage}</p>}

                <button onClick={validateAndSubmit} className="btn" disabled={loading}>
                    {loading ? "Resetting..." : "Reset password"}
                </button>
            </div>
        }
    </>
    );
};

export default ResetPasswordStep;

