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
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  switch (currentIndex) {
    case 0:
      const { username, usernameRef } = step.props;
      if (username === "" || username === " ") {
        //add the error
        setErrorMessage("الرجاء كتابة الاسم");
        const input = usernameRef.current;
        input.classList.add("border-red-500");
        return false;
      }
      return true;
    case 1:
      const { password, email, passwordRef, emailRef } = step.props;
      if (email === "" || email === " ") {
        setErrorMessage("الرجاء كتابة الايميل");
        const input = emailRef.current;
        input.classList.add("border-red-500");
        //add the error
        return false;
      }
      if (
        !RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$").test(email)
      ) {
        setErrorMessage("الرجاء كتابة الايميل بشكل صحيح");
        const input = emailRef.current;
        input.classList.add("border-red-500");
        //add the error
        return false;
      }
      if (password === "" || password === " ") {
        setErrorMessage("الرجاء كتابة الباسوورد");
        const input = passwordRef.current;
        input.classList.add("border-red-500");
        //add the error
        return false;
      }
      if (password.length < 8) {
        setErrorMessage("يجب ان لا يقل الباسوورد عن 8 احرف وارقام");
        const input = passwordRef.current;
        input.classList.add("border-red-500");
        //add the error
        return false;
      }
      if (password.length > 32) {
        setErrorMessage("يجب ان لا يزيد الباسوورد عن 32 حرف ورقم");
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
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
): IReturnValues {
  const [currentIndex, setCurrentIndex] = useState(0);
  const next = (): void => {
    if (currentIndex >= steps.length - 1) return;
    const areValid = validateInputs(
      steps[currentIndex],
      currentIndex,
      setErrorMessage
    );
    if (!areValid) return;
    setErrorMessage("");
    setCurrentIndex((prev) => prev + 1);
  };
  const previous = () => {
    if (currentIndex <= 0) return 0;
    setErrorMessage("");
    setCurrentIndex((prev) => prev - 1);
  };
  const byStep = (step: number): void => {
    if (currentIndex < 0 || step > steps.length - 1) return;
    if (step < currentIndex) {
      setErrorMessage("");
      return setCurrentIndex(step);
    }
    const areValid = validateInputs(
      steps[currentIndex],
      currentIndex,
      setErrorMessage
    );
    if (!areValid) return;
    setErrorMessage("");
    setCurrentIndex(step);
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
