import { useState } from "react";
import './steps.css'
import axios from "axios";
import { endpoints, base_backend_url } from "../../../utils/EndPoints";
interface EmailStepProps {
    onNext: () => void;
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>
}

const EmailStep: React.FC<EmailStepProps> = ({ onNext, email, setEmail }) => {
    const [isValidEmail, setIsValidEmail] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false);

    const validateEmail = () => {
        let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/;
        if (regex.test(email)) {
            setIsValidEmail(true)
            setErrorMessage("")
            return true
        } else {
            setIsValidEmail(false)
            setErrorMessage("Invalid Email address");
            return false
        }
    }
    const HandleSendOtp = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        const isValid = validateEmail()
        if (email && isValid) {
            try {
                const url = `${base_backend_url}${endpoints.users.sendOtp}`
                setLoading(true);
                await axios.post(url, { email })
                onNext()
            }
            catch (err: any) {
                setErrorMessage(err.response.data.message);

            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <div className="emailstep-container">
            <div className="input-container">
                <input
                    type="email"
                    placeholder="Enter your registered email"
                    className="input-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                <p className="error message">{(email && errorMessage) ? errorMessage : null}</p>
            </div>
            <button onClick={(e) => HandleSendOtp(e)} disabled={!email} className="btn">
                {loading ? "Sending Otp..." : "Send Otp"}</button>
        </div>
    );
};

export default EmailStep;