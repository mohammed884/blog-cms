import { useState, useRef, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
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
  const [addRegister, { isLoading: isRegistertionLoading }] =
    useRegisterMutation();
  const navigate = useNavigate();
  const [selectedTopics, setSelectedTopics] = useState<Array<string>>([]);
  const [message, setMessage] = useState<{
    success: boolean;
    context: string;
  }>();
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
  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!isLastStep) return next();
    await addRegister({
      username,
      email,
      password,
      topics: selectedTopics,
    })
      .unwrap()
      .then((fulfilled: any) => {
        setMessage({ success: true, context: "تم انشاء الحساب" });
        setTimeout(() => {
          navigate("/feed");
        }, 250);
      })
      .catch((reason) => {
        if (reason.data.usedUsername) {
          byStep(0);
          return setMessage({
            success: false,
            context: "هذا الاسم مسخدم سابقا",
          });
        }
        if (reason.data.usedEmail) {
          byStep(1);
          return setMessage({
            success: false,
            context: "هذا الايميل مستخدم سابقا",
          });
        }
      });
  };
  const {
    step,
    isFirstStep,
    isLastStep,
    totalSteps,
    currentIndex,
    next,
    previous,
    byStep,
  } = useMultistepForm(steps, setMessage);
  return (
    <section className="w-full h-[100vh] flex flex-col justify-center items-center">
      {isRegistertionLoading && <Loader />}
      <div className="lg:w-[60vw] md:w-[70vw] sm:w-[95vw] lg:h-[80vh] md:h-[70vh] sm:h-[70vh] flex flex-col justify-center items-center gap-4 shadow-md rounded-lg">
        <h1 className="text-[2.1rem] font-bold">انشئ حسابك</h1>
        <div className="w-[80%] flex flex-col justify-center items-center gap-7">
          <StepsIndicator
            totalSteps={totalSteps}
            currentIndex={currentIndex}
            byStep={byStep}
          />
          <form
            onSubmit={(e) => e.preventDefault()}
            className={`lg:w-[60%] md:w-[88%] sm:w-[95%] h-[100%] flex flex-col gap-5 justify-center mt-3 ${
              currentIndex < totalSteps - 1 && "mt-4"
            }`}
          >
            {message && (
              <div className="w-full h-fit text-md flex font-medium bg-gray-50 rounded-md">
                <div
                  className={`w-2 h-[100%] rounded-r-md ${
                    message.success ? "bg-emerald-500" : "bg-red-500"
                  }`}
                ></div>
                <span className="p-3">{message.context}</span>
              </div>
            )}

            <Suspense fallback={<Loader />}>{step}</Suspense>
            <MenuButtons
              isFirstStep={isFirstStep}
              isLastStep={isLastStep}
              handleSubmit={handleSubmit}
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
