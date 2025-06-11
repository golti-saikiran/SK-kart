import { useEffect, useRef, useState } from "react";
import './ForgotPasswordPage.css'

interface Step {
    stepTitle: string;
    Component: React.FC<{ onNext: () => void }>;
    Props?: {
        email?: string;
        setEmail?: React.Dispatch<React.SetStateAction<string>>
    }
}

interface StepperProps {
    stepsConfig: Step[];
}

const Stepper: React.FC<StepperProps> = ({ stepsConfig }) => {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [margins, setMargins] = useState<{ marginLeft: number; marginRight: number }>({
        marginLeft: 0,
        marginRight: 0,
    });

    const stepRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (stepRef.current.length > 0) {
            setMargins({
                marginLeft: stepRef.current[0]?.offsetWidth! / 2 || 0,
                marginRight: stepRef.current[stepsConfig.length - 1]?.offsetWidth! / 2 || 0,
            });
        }
    }, [currentStep, stepsConfig.length]);

    const handleNext = () => {
        setCurrentStep((prevStep) => {
            if (prevStep === stepsConfig.length - 1) {
                setIsComplete(true);
                return prevStep;
            }
            return prevStep + 1;
        });
    };
    // const onIndexClick = (index: number) => {
    //     if (index < currentStep) {
    //         setCurrentStep(index)
    //     }
    // }

    const calculateProgressBarWidth = (): number => {
        return (currentStep / (stepsConfig.length - 1)) * 100;
    };

    const ActiveComponent = stepsConfig[currentStep].Component;
    const Props = stepsConfig[currentStep].Props

    return (
        <div className="stepper-container">
            <div className="stepper">
                {stepsConfig.map((step, index) => (
                    <div
                        className={`step ${currentStep > index || isComplete ? "complete" : ""} ${currentStep === index ? "active" : ""
                            }`}
                        ref={(el) => (stepRef.current[index] = el)}
                        key={index}
                    // onClick={() => onIndexClick(index)}
                    >
                        <div className="step-number">    {currentStep > index || isComplete ? (
                            <span>&#10003;</span>
                        ) : (
                            index + 1
                        )}</div>
                        <div className="step-title">{step.stepTitle}</div>
                    </div>
                ))}

                <div
                    className="progress-bar"
                // style={{
                //     width: `calc(100% - ${margins.marginLeft + margins.marginRight}px)`,
                //     marginLeft: margins.marginLeft,
                //     marginRight: margins.marginRight,
                // }}
                >
                    <div className="progress" style={{ width: `${calculateProgressBarWidth()}%` }}></div>
                </div>
            </div>

            <ActiveComponent onNext={handleNext} {...Props} />
        </div>
    );
};

export default Stepper;
