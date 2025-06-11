import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { endpoints, base_backend_url } from "../../../utils/EndPoints";
import { toast } from "react-toastify";

interface OTPStepProps {
    onNext: () => void;
    email: string
}

const OTPStep: React.FC<OTPStepProps> = ({ onNext, email }) => {
    const [input, setInput] = useState(new Array(6).fill(''))
    const [errorMessage, setErrorMessage] = useState('')
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const disableCondition = input.some((char) => char === "");

    useEffect(() => {
        inputRefs.current[0]?.focus()
    }, [])

    const HandleOTPChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value
        if (isNaN(Number(value))) {
            return
        }
        const newInput = [...input];
        newInput[index] = value.substring(value.length - 1)
        setInput(newInput)

        if (value && index < input.length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus()
        } else if (index === input.length - 1) {
            buttonRef.current?.focus();
        }
    }
    const HandleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !input[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1]?.focus()
        }
    }
    const HandleOTPSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        try {
            const otp = input.join('')
            const payload = {
                email,
                otp
            }
            const url = `${base_backend_url}${endpoints.users.verifyOTP}`
            await axios.post(url, payload)
            setInput(new Array(6).fill(''))
            setErrorMessage('')
            onNext()
        }
        catch (err: any) {
            setErrorMessage(err.response.data.message);
        }
    }

    return (
        <>
            <p className="message">An otp is sent to your registered email</p>
            <div className="emailstep-container">
                <div className="otp-input-container">
                    {input.map((value, index) => {
                        return (
                            <input
                                key={index}
                                ref={input => (inputRefs.current[index] = input)}
                                className="otp-input"
                                type="text"
                                value={value}
                                onChange={(e) => HandleOTPChange(e, index)}
                                onKeyDown={(e) => HandleKeyDown(e, index)}
                            />
                        )
                    })}
                </div>
                <p className="error message">{errorMessage ? errorMessage : null}</p>
                <button
                    onClick={(e) => HandleOTPSubmit(e)}
                    className="btn"
                    ref={buttonRef}
                    disabled={disableCondition}>
                    Continue
                </button>
                <p>OTP expires in 1 hr  <button onClick={() => toast.warn("not implimented yet")}>Resend OTP</button></p>
            </div>
        </>
    );
};

export default OTPStep;
