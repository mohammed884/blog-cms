import React, { useState, useRef, Suspense, lazy } from "react";
import { UsernameStep, EmailAndPasswordStep } from "./components/steps";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import useMultistepForm from "./components/useMultistepForm";
import { StepsIndicator, MenuButtons } from "./components/StepsControl";
import { useRegisterMutation } from "../../store/services/auth";
const TopicsSelectionStep = lazy(
  () => import("./components/TopicsSelectionStep")
);
const Register = () => {
  const [addRegister, { data, isLoading, isError, error }] =
    useRegisterMutation();
  const [selectedTopics, setSelectedTopics] = useState<Array<string>>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const popupRef = useRef<HTMLDivElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const steps = [
    <UsernameStep
      usernameRef={usernameRef}
      username={username}
      setUsername={setUsername}
    />,

    <EmailAndPasswordStep
      passwordRef={passwordRef}
      emailRef={emailRef}
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
    />,
    <TopicsSelectionStep
      ref={popupRef}
      selectedTopics={selectedTopics}
      setSelectedTopics={setSelectedTopics}
    />,
  ];
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(isLoading, isError);
    await addRegister({
      username,
      email,
      password,
      topics: selectedTopics,
    });
    if (isLoading) return console.log("loading");
    if (isError)
      return setErrorMessage(
        (error as { data: { message: string } })?.data.message || "Error"
      );
  };
  const { step, totalSteps, currentIndex, next, previous, byStep } =
    useMultistepForm(steps, setErrorMessage);
  return (
    <section className="w-full h-[100vh] flex flex-col justify-center items-center">
      <div className="w-[60vw] h-[80vh] flex flex-col justify-center items-center gap-4 shadow-md rounded-lg">
        <h1 className="text-[2.1rem] font-bold">انشئ حسابك</h1>
        <div className="w-[80%] flex flex-col justify-center items-center gap-7">
          <StepsIndicator
            totalSteps={totalSteps}
            currentIndex={currentIndex}
            byStep={byStep}
          />
          <form
            className={`w-[60%] h-[100%] flex flex-col gap-5 justify-center mt-3 ${
              currentIndex < totalSteps - 1 && "mt-4"
            }`}
            onSubmit={handleSubmit}
          >
            {errorMessage && (
              <div className="w-full h-fit text-md flex font-medium bg-gray-50 rounded-md">
                <div className="w-2 h-[100%] rounded-r-md bg-red-500"></div>
                <span className="p-3">{errorMessage}</span>
              </div>
            )}
            <Suspense fallback={<Loader />}>{step}</Suspense>
            <MenuButtons
              totalSteps={totalSteps}
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
