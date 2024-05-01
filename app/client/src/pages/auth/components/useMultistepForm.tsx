import { useState, ReactElement } from "react";
interface IReturnValues {
  step: ReactElement;
  isFirstStep: boolean;
  isLastStep: boolean;
  currentIndex: number;
  totalSteps: number;
  next: () => void;
  previous: () => void;
  byStep: (step: number) => void;
}
const validateInputs = (
  step: ReactElement,
  currentIndex: number,
  setMessage: React.Dispatch<
    React.SetStateAction<
      | {
          success: boolean;
          context: string;
        }
      | undefined
    >
  >
) => {
  switch (currentIndex) {
    case 0:
      const { username, usernameRef } = step.props;
      if (username === "" || username === " ") {
        //add the error
        setMessage({ success: false, context: "الرجاء كتابة الاسم" });
        const input = usernameRef.current;
        input.classList.add("border-red-500");
        return false;
      }
      return true;
    case 1:
      const { password, email, passwordRef, emailRef } = step.props;
      if (email === "" || email === " ") {
        setMessage({ success: false, context: "الرجاء كتابة الايميل" });
        const input = emailRef.current;
        input.classList.add("border-red-500");
        //add the error
        return false;
      }
      if (
        !RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$").test(email)
      ) {
        setMessage({
          success: false,
          context: "الرجاء كتابة الايميل بشكل صحيح",
        });
        const input = emailRef.current;
        input.classList.add("border-red-500");
        //add the error
        return false;
      }
      if (password === "" || password === " ") {
        setMessage({ success: false, context: "الرجاء كتابة الباسوورد" });
        const input = passwordRef.current;
        input.classList.add("border-red-500");
        //add the error
        return false;
      }
      if (password.length < 8) {
        setMessage({
          success: false,
          context: "يجب ان لا يقل الباسوورد عن 8 احرف وارقام",
        });
        const input = passwordRef.current;
        input.classList.add("border-red-500");
        //add the error
        return false;
      }
      if (password.length > 32) {
        setMessage({
          success: false,
          context: "يجب ان لا يزيد الباسوورد عن 32 حرف ورقم",
        });
        const input = passwordRef.current;
        input.classList.add("border-red-500");
        //add the error
        return false;
      }
      return true;
    default:
  }
};
export default function useMultistepForm(
  steps: Array<ReactElement>,
  messageContext: string | undefined,
  setMessage: React.Dispatch<
    React.SetStateAction<
      | {
          success: boolean;
          context: string;
        }
      | undefined
    >
  >
): IReturnValues {
  const [currentIndex, setCurrentIndex] = useState(0);
  const next = (): void => {
    if (currentIndex >= steps.length - 1) return;
    const areValid = validateInputs(
      steps[currentIndex],
      currentIndex,
      setMessage
    );
    if (!areValid) return;
    if (messageContext) setMessage({ success: false, context: "" });
    setCurrentIndex((prev) => prev + 1);
  };
  const previous = () => {
    if (currentIndex <= 0) return 0;
    if (messageContext) setMessage({ success: false, context: "" });
    setCurrentIndex((prev) => prev - 1);
  };
  const byStep = (step: number): void => {
    if (currentIndex < 0 || step > steps.length - 1) return;
    if (step < currentIndex) {
      if (messageContext) setMessage({ success: false, context: "" });
      setMessage({ success: false, context: "" });
      return setCurrentIndex(step);
    }
  };
  return {
    step: steps[currentIndex],
    isFirstStep: currentIndex === 0,
    isLastStep: currentIndex === steps.length - 1,
    currentIndex: currentIndex,
    totalSteps: steps.length,
    next,
    previous,
    byStep,
  };
}
