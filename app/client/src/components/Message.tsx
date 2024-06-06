interface IMessageProps {
  context: string;
  type?: "error" | "alert" | "success";
  success: boolean;
}
const Message = ({ context, success, type }: IMessageProps) => {
  return (
    <div className="w-full h-fit text-[.9rem] flex font-medium bg-gray-50 rounded-md">
      <div
        className={`w-2 h-[100%] rounded-r-md ${
          success ? "bg-emerald-500" : "bg-red-500"
        }`}
      ></div>
      <span className="p-3">{context}</span>
    </div>
  );
};
export default Message;
