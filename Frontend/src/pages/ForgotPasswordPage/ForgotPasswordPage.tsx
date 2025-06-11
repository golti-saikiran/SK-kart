import { useState } from "react";
import Stepper from "./Stepper";
import EmailStep from "./steps/EmailStep";
import OTPStep from "./steps/OTPStep";
import ResetPasswordStep from "./steps/ResetPasswordStep";
import "./ForgotPasswordPage.css"; // Optional: custom styles for layout

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState("");

    const stepsConfig = [
        {
            stepTitle: "Enter Email",
            Component: EmailStep,
            Props: { email, setEmail },
        },
        {
            stepTitle: "Validate OTP",
            Component: OTPStep,
            Props: { email },
        },
        {
            stepTitle: "Reset Password",
            Component: ResetPasswordStep,
            Props: { email },
        },
    ];

    return (
        <div className="forgot-password-container">
            <h2>Forgot Password</h2>
            <Stepper stepsConfig={stepsConfig} />
        </div>
    );
};

export default ForgotPasswordPage;
