import axios from "axios";
import { useRef, useState } from "react";
import { endpoints, base_backend_url } from "../../../utils/EndPoints";
import { toast } from "react-toastify";
import OtpInputField from "../../../components/OTPinputField/OtpInputField";

interface OTPStepProps {
    onNext: () => void;
    email: string;
}

const OTPStep: React.FC<OTPStepProps> = ({ onNext, email }) => {
    const [input, setInput] = useState(new Array(6).fill(''));
    const [errorMessage, setErrorMessage] = useState('');
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const disableCondition = input.some((char) => char === "");

    const handleChange = (index: number, value: string) => {
        const newInput = [...input];
        newInput[index] = value;
        setInput(newInput);
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !input[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleOTPSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            const otp = input.join('');
            const url = `${base_backend_url}${endpoints.users.verifyOTP}`;
            await axios.post(url, { email, otp });
            setInput(new Array(6).fill(''));
            setErrorMessage('');
            onNext();
        } catch (err: any) {
            setErrorMessage(err.response?.data?.message || "Invalid OTP");
        }
    };

    return (
        <>
            <p className="message">An OTP is sent to your registered email</p>
            <div className="emailstep-container">
                <OtpInputField
                    length={6}
                    values={input}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
                {errorMessage && <p className="error message">{errorMessage}</p>}
                <button
                    onClick={handleOTPSubmit}
                    className="btn"
                    ref={buttonRef}
                    disabled={disableCondition}
                >
                    Continue
                </button>
                <p>
                    OTP expires in 1 hr{" "}
                    <button onClick={() => toast.warn("Resend OTP not implemented yet")}>
                        Resend OTP
                    </button>
                </p>
            </div>
        </>
    );
};

export default OTPStep;
