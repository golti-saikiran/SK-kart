import { useState } from "react";

type StepConfig = {
    stepTitle: string;
    Component: React.FC<any>;
    Props?: any;
};

interface StepperProps {
    stepsConfig: StepConfig[];
}

const Stepper: React.FC<StepperProps> = ({ stepsConfig }) => {
    const [step, setStep] = useState(0);
    const StepComponent = stepsConfig[step].Component;
    const props = stepsConfig[step].Props || {};

    const goToNextStep = () => {
        if (step < stepsConfig.length - 1) {
            setStep((prev) => prev + 1);
        }
    };

    return (
        <div className="stepper-container">
            <h3>{stepsConfig[step].stepTitle}</h3>
            <StepComponent {...props} onNext={goToNextStep} />
            <div className="step-indicator">
                Step {step + 1} of {stepsConfig.length}
            </div>
        </div>
    );
};

export default Stepper;
