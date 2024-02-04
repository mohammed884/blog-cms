import { forwardRef, useImperativeHandle } from "react";
interface IUsernameProps {
  username: string;
  usernameRef: React.RefObject<HTMLInputElement>;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}
interface IAuthProps {
  emailRef: React.RefObject<HTMLInputElement>;
  passwordRef: React.RefObject<HTMLInputElement>;
  email: string;
  password: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}
const inputClasses = "w-full border border-gray-300 rounded-md mb-3 px-3 py-2";
const UsernameStep = forwardRef<HTMLInputElement, IUsernameProps>(
  ({ username, setUsername, usernameRef }, ref) => {
    return (
      <fieldset className="flex flex-col">
        <label htmlFor="username" className="hidden">
          الاسم الكريم
        </label>
        <input
          ref={usernameRef}
          required
          className={inputClasses}
          placeholder="ادخل اسمك الكريم"
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </fieldset>
    );
  }
);
const EmailAndPasswordStep = forwardRef<HTMLInputElement, IAuthProps>(
  ({ email, password, setEmail, setPassword, emailRef, passwordRef }, ref) => {
    return (
      <fieldset>
        <label htmlFor="email" className="hidden">
          البريد الالكتروني
        </label>
        <input
          ref={emailRef}
          required
          placeholder="البريد الالكتروني"
          className={inputClasses}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password" className="hidden">
          كلمة المرور
        </label>
        <input
          ref={passwordRef}
          required
          placeholder="كلمة المرور"
          className={inputClasses}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </fieldset>
    );
  }
);
export { UsernameStep, EmailAndPasswordStep };
