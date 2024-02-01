import React, { useState, useRef, Suspense, lazy } from "react";
import { UsernameStep, EmailAndPasswordStep } from "./components/steps";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import useMultistepForm from "./components/useMultistepForm";
import { StepsIndicator, MenuButtons } from "./components/StepsControl";
const TopicsDialog = lazy(() => import("./components/TopicsPopup"));
const Register = () => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [validationError, setValidationError] = useState({
    refs: [],
    errors: [],
  });
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const steps = [
    <UsernameStep
      setValidationError={setValidationError}
      username={username}
      setUsername={setUsername}
    />,
    <EmailAndPasswordStep
      setValidationError={setValidationError}
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
    />,
    <TopicsDialog ref={popupRef} />,
  ];
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const { step, currentIndex, next, previous, byStep } =
    useMultistepForm(steps);
  return (
    <section className="w-full h-[100vh] flex flex-col justify-center items-center">
      <div className="w-[60vw] h-[80vh] flex flex-col justify-center items-center gap-4 shadow-lg rounded-lg">
        <h1 className="text-[2.1rem] font-bold">انشئ حسابك</h1>
        <div className="w-[80%] h-[40%] flex flex-col gap-7 items-center">
          <StepsIndicator
            totalSteps={steps.length}
            currentIndex={currentIndex}
            byStep={byStep}
          />
          <form
            className={`w-[70%] h-[100%] flex flex-col gap-8 justify-center mt-3 ${
              currentIndex < steps.length - 1 && "mt-4"
            }`}
            onSubmit={handleSubmit}
          >
            <Suspense fallback={<Loader />}>{step}</Suspense>
            <MenuButtons
              totalSteps={steps.length}
              currentIndex={currentIndex}
              next={next}
              previous={previous}
            />
          </form>
          <div className="flex gap-2 mt-3 text-sm">
            <p className="mb-1">لديك حساب؟</p>
            <Link className="text-dark_green underline" to="/auth/login">
              سجل الدخول من هنا
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
