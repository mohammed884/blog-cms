import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLoginMutation } from "../../store/services/auth";
import Loader from "../../components/Loader";
import { useAppDispatch } from "../../store/hooks";
import apiService from "../../store/services/index";
import {} from "../../store/services/index";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{
    context: string;
    success: boolean;
  }>();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!email) {
      return setMessage({ success: false, context: "الرجاء كتابة الايميل" });
    }
    if (!password) {
      return setMessage({ success: false, context: "الرجاء كتابة الباسوورد" });
    }
    if (8 > password.length) {
      return setMessage({
        success: false,
        context: "يجب ان لا يقل الباسوورد عن 8 ارقام واحرف",
      });
    }
    if (32 < password.length) {
      return setMessage({
        success: false,
        context: "يجب ان لا يزيد الباسوورد عن 32 ارقام واحرف",
      });
    }
    await login({ password, email })
      .unwrap()
      .then((fulfilled) => {
        setMessage({ success: true, context: "تم تسجيل الدخول بنجاح" });
        dispatch(apiService.util.resetApiState());
        setTimeout(() => {
          navigate("/feed");
        }, 450);
      })
      .catch((reason) => {
        console.log("catch error ->", reason);
        setMessage({ success: false, context: reason.data?.message });
      });
  };
  const inputsClasses =
    "w-full border border-gray-300 rounded-md mb-3 px-3 py-2";
  const btnClasses =
    "w-full font-bold bg-black text-white text-sm rounded-md mb-3 px-3 py-3";
  return (
    <section className="w-full h-[100vh] flex justify-center items-center">
      {isLoginLoading && <Loader />}
      <div className="lg:w-[60vw] md:w-[70vw] sm:w-[95vw] lg:h-[80vh] md:h-[70vh] sm:h-[70vh] flex flex-col gap-5 justify-center items-center shadow-md rounded-lg">
        <div className="text-center">
          <h1 className="text-[2.1rem] font-bold">اهلا بعودتك</h1>
        </div>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="lg:w-[60%] md:w-[88%] sm:w-[95%] flex flex-col lg:gap-1 md:gap-2 sm:gap-4"
        >
          <label htmlFor="email" className="hidden">
            البريد الالكتروني
          </label>
          {message && (
            <div className="w-full h-fit text-md flex font-medium bg-gray-50 rounded-md mb-3">
              <div
                className={`w-2 h-[100%] rounded-r-md ${
                  message.success ? "bg-emerald-500" : "bg-red-500"
                }`}
              ></div>
              <span className="p-3">{message.context}</span>
            </div>
          )}
          <input
            required
            className={inputsClasses}
            autoFocus
            type="email"
            placeholder="البريد الالكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password" className="hidden">
            كلمة المرور
          </label>
          <input
            required
            className={inputsClasses}
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" onClick={handleSubmit} className={btnClasses}>
            تسجيل الدخول
          </button>
        </form>

        <div className="flex gap-2 mt-3 text-sm">
          <p className="mb-1">لا تمتلك حسابا ؟</p>
          <Link className="text-dark_green underline" to="/auth/register">
            انشئ حسابك من هنا
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Login;
