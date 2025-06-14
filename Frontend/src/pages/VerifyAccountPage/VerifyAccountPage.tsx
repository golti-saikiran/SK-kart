// pages/VerifyAccount.tsx

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import OtpInputField from "../../components/OTPinputField/OtpInputField"; // Adjust the path if needed
import { base_backend_url, endpoints } from "../../utils/EndPoints";
import "./VerifyAccountPage.css"; 
import { useSearchParams } from "react-router-dom";

const VerifyAccount = () => {
    const [otpValues, setOtpValues] = useState(new Array(6).fill(""));
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("userId") || "";

    const handleChange = (index: number, value: string) => {
        const newOtp = [...otpValues];
        newOtp[index] = value;
        setOtpValues(newOtp);
    };
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otpValues[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const otp = otpValues.join("");
        if (otp.length < 6) {
            return setErrorMessage("Please enter the full 6-digit OTP");
        }

        try {
            const url = `${base_backend_url}${endpoints.users.verifyEmail}`;
            await axios.post(url, {userId , otp });
            toast.success("Account verified successfully!");
            navigate("/login");
        } catch (err: any) {
            setErrorMessage(err.response?.data?.message || "Invalid OTP");
        }
    };

    return (
        <div className="verify-container">
            <h2>Verify Your Account</h2>
            <p>Enter the 6-digit OTP sent to your register email</p>
            <OtpInputField
                length={6}
                values={otpValues}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />

            {errorMessage && <p className="error-text">{errorMessage}</p>}

            <button
                className="verify-btn"
                onClick={handleVerify}
                disabled={otpValues.includes("")}
            >
                Verify
            </button>

            <p className="resend-text">
                Didn't get OTP?{" "}
                <button onClick={() => toast.info("Resend OTP not implemented yet")} className="resend-btn">
                    Resend OTP
                </button>
            </p>
        </div>
    );
};

export default VerifyAccount;
