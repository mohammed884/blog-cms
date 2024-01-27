import React, { useRef, useState, Suspense, lazy } from "react";
import { ITopic } from "../../interfaces/global";
import {
  UsernameStep,
  EmailAndPasswordStep,
  SelectedTopics,
} from "./components/steps";
import { Link } from "react-router-dom";
const TopicsDialog = lazy(() => import("./components/TopicsDialog"));
const Register = () => {
  const [stepCounter, setStepCounter] = useState(0);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<Array<ITopic>>([]);
  const topicsPopup = useRef<HTMLDialogElement>(null);
  const steps = [
    <UsernameStep username={username} setUsername={setUsername} />,
    <EmailAndPasswordStep
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
    />,
    <SelectedTopics
      selectedTopics={selectedTopics}
      setSelectedTopics={setSelectedTopics}
    />,
  ];
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };
  const handleChangingStep = (action: "next" | "prev") => {
    if (action === "next" && stepCounter < steps.length - 1) {
      //add validation
      setStepCounter(stepCounter + 1);
    } else if (stepCounter > 0) {
      setStepCounter(stepCounter - 1);
    }
  };
  const btnStyles = "border-2 p-2 px-5 text-sm rounded-md";
  return (
    <section className="w-full h-[100vh] flex flex-col justify-center items-center">
      <div className="w-[50vw] h-[70vh] flex flex-col justify-center items-center shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold">انشئ حسابك</h1>
        <div className="w-[80%] h-[40%] flex flex-col gap-3 mt-5 items-center">
          <div className="w-[50%] flex gap-1 justify-center items-center">
            {steps.map((step, index) => {
              return (
                <React.Fragment key={index}>
                  <div
                    itemType="button"
                    onClick={() => handleChangingStep("next")}
                    className={`
                  w-6 h-6 flex justify-center items-center text-sm text-black text-center font-bold transition-colors ease-linear border pt-[.19rem] rounded-[50%] cursor-pointer
                  ${
                    index <= stepCounter
                      ? "border-dark_green"
                      : "border-gray-300"
                  }`}
                  >
                    <span>{index + 1}</span>
                  </div>
                  <div
                    className={`w-8 h-[.15rem] transition-colors ease-linear rounded-md ${
                      index >= stepCounter ? "bg-gray-200" : "bg-dark_green"
                    } ${index === steps.length - 1 && "hidden"}`}
                  ></div>
                </React.Fragment>
              );
            })}
          </div>
          <form
            className="w-[60%] h-[100%] flex flex-col justify-center mt-4"
            onSubmit={handleSubmit}
          >
            {steps[stepCounter]}
            <Suspense fallback={<div>Loading...</div>}>
              {stepCounter === steps.length - 1 && (
                <TopicsDialog ref={topicsPopup} />
              )}
            </Suspense>
            <fieldset className="w-[60%] flex justify-between mx-auto mt-2">
              {stepCounter < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => handleChangingStep("next")}
                  className={`${stepCounter === steps.length - 1 && "hidden"} ${
                    stepCounter === 0 && "w-[100%]"
                  } ${btnStyles} border-[#36454F]`}
                >
                  التالي
                </button>
              ) : (
                <button
                  type="submit"
                  className={`${btnStyles} border-[#36454F]`}
                >
                  انشاء الحساب
                </button>
              )}
              <button
                type="button"
                onClick={() => handleChangingStep("prev")}
                className={`${stepCounter === 0 && "hidden"} ${btnStyles}`}
              >
                رجوع
              </button>
            </fieldset>
          </form>
          <div className="flex gap-2 text-sm">
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
