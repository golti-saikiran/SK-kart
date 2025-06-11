import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { endpoints, base_backend_url } from "../../../utils/EndPoints";
import { toast } from "react-toastify";

interface OTPStepProps {
    onNext: () => void;
    email: string;
}

const OTPStep: React.FC<OTPStepProps> = ({ onNext, email }) => {
    const [input, setInput] = useState(new Array(6).fill(''));
    const [errorMessage, setErrorMessage] = useState('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const disableCondition = input.some((char) => char === "");

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        if (isNaN(Number(value))) return;
        const newInput = [...input];
        newInput[index] = value.slice(-1);
        setInput(newInput);

        if (value && index < input.length - 1) {
            inputRefs.current[index + 1]?.focus();
        } else if (index === input.length - 1) {
            buttonRef.current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
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
                <div className="otp-input-container">
                    {input.map((value, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            className="otp-input"
                            type="text"
                            maxLength={1}
                            value={value}
                            onChange={(e) => handleOTPChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                    ))}
                </div>
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
