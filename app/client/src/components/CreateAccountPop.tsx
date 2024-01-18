import { useState, forwardRef, FormEvent, useEffect } from "react";
import { Link } from "react-router-dom";
const CreateAccountPop = forwardRef<HTMLDialogElement, {}>(
  (props, dialogRef: any) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
    const inputsClasses =
      "w-full border border-gray-300 rounded-md mb-3 px-3 py-2";
    const btnClasses =
      "w-full bg-dark_green text-white rounded-md mb-3 px-3 py-2";
    const handleLogin = (e: FormEvent) => {
      e.preventDefault();
    };
    useEffect(() => {
      console.log("create account loaded");

      dialogRef.current?.addEventListener("click", backdropEventListener);
      return () => {
        document.body.style.overflowY = "visible";
        dialogRef.current?.removeEventListener("click", backdropEventListener);
      };
    }, []);
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
              <h3 className="text-2xl font-bold mb-2">انشىء حسابك</h3>
              <p>ابدء برحتلك في استكشاف محتوى كتابي فريد من نوعه</p>
            </div>
            <form onSubmit={handleLogin} className="w-full flex flex-col">
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
export default CreateAccountPop;
