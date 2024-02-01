import { ITopic } from "../../../interfaces/global";
import { useAppSelector } from "../../../store/hooks";
import { selectTopics } from "../../../store/services/topics";
interface IUsernameProps {
  setValidationError: React.Dispatch<
    React.SetStateAction<{
      refs: never[];
      errors: never[];
    }>
  >;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}
interface IAuthProps {
  setValidationError: React.Dispatch<
    React.SetStateAction<{
      refs: never[];
      errors: never[];
    }>
  >;
  email: string;
  password: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}
const inputClasses = "w-full border border-gray-300 rounded-md mb-3 px-3 py-2";
const UsernameStep = ({ username, setUsername }: IUsernameProps) => {
  return (
    <fieldset className="flex flex-col">
      <label htmlFor="username" className="hidden">
        الاسم الكريم
      </label>
      <input
        className={inputClasses}
        placeholder="ادخل اسمك الكريم"
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
    </fieldset>
  );
};
const EmailAndPasswordStep = ({
  email,
  password,
  setEmail,
  setPassword,
}: IAuthProps) => {
  return (
    <fieldset>
      <label htmlFor="email" className="hidden">
        البريد الالكتروني
      </label>
      <input
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
        placeholder="كلمة المرور"
        className={inputClasses}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </fieldset>
  );
};
export { UsernameStep, EmailAndPasswordStep };
