import { Link } from "react-router-dom";
import { useState } from "react";
import { useLoginMutation } from "../../store/services/auth";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, isSuccess, isError, error }] = useLoginMutation();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    console.log(email, password);
    const data = await login({ password, email });
    console.log(data);
  };
  console.log(
    "loading",
    isLoading,
    "success",
    isSuccess,
    "is error",
    isError,
    "err",
    error
  );

  const inputsClasses =
    "w-full border border-gray-300 rounded-md mb-3 px-3 py-2";
  const btnClasses =
    "w-full font-bold bg-black text-white text-sm rounded-md mb-3 px-3 py-3";
  return (
    <section className="w-full h-[100vh] flex justify-center items-center">
      <div className="lg:w-[60vw] md:w-[70vw] sm:w-[95vw] lg:h-[80vh] md:h-[70vh] sm:h-[70vh] flex flex-col gap-5 justify-center items-center shadow-md rounded-lg">
        <div className="text-center">
          <h1 className="text-[2.1rem] font-bold">اهلا بعودتك</h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="lg:w-[60%] md:w-[88%] sm:w-[95%] flex flex-col lg:gap-1 md:gap-2 sm:gap-4"
        >
          <label htmlFor="email" className="hidden">
            البريد الالكتروني
          </label>
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
          <button type="submit" className={btnClasses}>
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
