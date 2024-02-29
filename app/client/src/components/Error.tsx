import { useEffect } from "react";

interface IProps {
  message: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}
const Error = ({ message, setErrorMessage }: IProps) => {
  useEffect(() => {
    const hideTimeout = setTimeout(() => {
      setErrorMessage("");
    }, 1500);
    return () => {
      clearInterval(hideTimeout);
    };
  });
  return (
    <div
      className={`bg-red-50 w-[50%] fixed left-[50%] translate-x-[-50%]  ${
        message ? "translate-y" : "translate-y-[-150px]"
      } transition-transform z-10 rounded-md ease-out`}
    >
      <div className="h-fit flex items-center gap-2 bg-red-50 text-md font-medium rounded-md">
        <div className="text-sm py-4 w-2 h-full rounded-r-md bg-red-400 text-red-400">
          0
        </div>
        <div className="flex items-center gap-[.35rem] text-[.9rem]">
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
};

export default Error;
