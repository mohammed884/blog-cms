import { useState, forwardRef, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../store/services/auth";
import apiService from "../store/services";
import { useAppDispatch } from "../store/hooks";
const LoginPopup = forwardRef<HTMLDialogElement, {}>(
  (props, dialogRef: any) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState<{
      success: boolean;
      context: string;
    }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [login, { isLoading: isLoginLoading }] = useLoginMutation();
    useEffect(() => {
      dialogRef.current?.addEventListener("click", backdropEventListener);
      return () => {
        document.body.style.overflowY = "visible";
        dialogRef.current?.removeEventListener("click", backdropEventListener);
      };
    }, []);
    const backdropEventListener = (e: any) => {
      const target = e.target;
      if (target.tagName !== "DIALOG") return;
      const dialog = e.target.closest("dialog");
      dialog.close();
      document.body.style.overflowY = "visible";
    };
    const handleClose = () => {
      document.body.style.overflowY = "visible";
      dialogRef.current?.removeEventListener("click", backdropEventListener);
    };
    const handleLogin = async (e: FormEvent) => {
      e.preventDefault();
      if (!email) {
        setMessage({ success: false, context: "الرجاء كتابة الايميل" });
      }
      if (!password) {
        setMessage({ success: false, context: "الرجاء كتابة الباسوورد" });
      }
      if (8 > password.length) {
        setMessage({
          success: false,
          context: "يجب ان لا يقل الباسوورد عن 8 ارقام واحرف",
        });
      }
      if (32 < password.length) {
        setMessage({
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
          }, 250);
        })
        .catch((reason) => {
          setMessage({ success: false, context: reason.data.message });
          console.log("catch error ->", reason);
        });
    };
    const inputsClasses =
      "w-full border border-gray-300 rounded-md mb-3 px-3 py-2";
    const btnClasses =
      "w-full bg-dark_green text-white rounded-md mb-3 px-3 py-2";
    return (
      <dialog
        ref={dialogRef}
        className="lg:w-[50vw] lg:h-[70vh] portrait:md:w-[80vw] portrait:md:h-[80vh] sm:w-[90vw] sm:h-[100vh] sm:mx-auto lg:mx-0 sm:top-5 portrait:md:top-[7.7rem] rounded-lg fixed lg:left-[50%] lg:top-[50%] lg:translate-x-[-50%] lg:translate-y-[-50%] z-[10001]"
      >
        <div className="sm:w-[90%] md:w-[80%] h-full mx-auto flex flex-col justify-between items-center">
          <form
            method="dialog"
            className="w-full flex items-start mt-3 mx-auto"
            onSubmit={handleClose}
          >
            <button className="w-5 h-5 ml-auto mb-2">
              <img
                src="../../../../public/svgs/close-button.svg"
                alt="close button"
              />
            </button>
          </form>
          <div className="w-full sm:h-[50vh] flex flex-col sm:justify-evenly">
            <div className="mb-7">
              <h3 className="text-3xl font-black mb-3">سجل الدخول</h3>
              <p>اكمل رحلتك في استكشاف محتوى كتابي فريد من نوعه</p>
            </div>
            <form onSubmit={handleLogin} className="w-full flex flex-col">
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
            <span className="text-dark_green font-bold mt-3 hover:underline">
              <Link to="/auth/register">لا تمتلك حساب؟</Link>
            </span>
          </div>
          <div></div>
        </div>
      </dialog>
    );
  }
);
export default LoginPopup;
