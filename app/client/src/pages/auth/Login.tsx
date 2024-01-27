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
    "w-full bg-dark_green text-white rounded-md mb-3 px-3 py-2";
  return (
    <section className="w-full h-[100vh] flex justify-center items-center">
      <div className="w-[50%] h-[70vh] flex flex-col justify-center items-center shadow-md rounded-lg">
        <div className="mb-4 text-center">
          <h1 className="text-[1.8rem] font-bold">اهلا بعودتك</h1>
        </div>
        <form onSubmit={handleSubmit} className="w-[60%] flex flex-col">
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

        <span className=" text-dark_green text-sm mx-auto font-bold mt-3 hover:underline">
          <Link to="/auth/register">لا تمتلك حسابا؟</Link>
        </span>
      </div>
    </section>
  );
};

export default Login;
