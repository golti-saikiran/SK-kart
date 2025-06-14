// components/OtpInputField.tsx
import React, { useEffect, useRef } from "react";

interface OtpInputFieldProps {
    length: number;
    values: string[];
    onChange: (index: number, value: string) => void;
    onKeyDown: (index: number, event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const OtpInputField: React.FC<OtpInputFieldProps> = ({
    length,
    values,
    onChange,
    onKeyDown,
}) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    return (
        <div className="otp-input-container">
            {Array.from({ length }).map((_, index) => (
                <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="otp-input"
                    type="text"
                    maxLength={1}
                    value={values[index]}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (!isNaN(Number(value))) {
                            onChange(index, value.slice(-1));
                            if (value && index < length - 1) {
                                inputRefs.current[index + 1]?.focus();
                            }
                        }
                    }}
                    onKeyDown={(e) => {
                        onKeyDown(index, e);
                        if (e.key === "Backspace" && !values[index] && index > 0) {
                            inputRefs.current[index - 1]?.focus();
                        }
                    }}
                />
            ))}
        </div>
    );
};

export default OtpInputField;
