import { useBlockUserActionsMutation } from "../../../../services/queries/user";
interface IBlockButtonProps {
  blockIndex: number;
  className?: string;
  userId: string;
  action: "block" | "un-block";
}
interface IButtonProps {
  userId: string;
  text: "حظر" | "الغاء الحظر" | "اتابع";
  action: "block" | "un-block";
  className?: string;
  blockIndex: number;
}
const Button = ({
  userId,
  text,
  action,
  className,
  blockIndex,
}: IButtonProps) => {
  const btnStyle = ` 
    text-[.8rem] 
    p-[.41rem] 
    py-2 
    px-6 
    transition-colors 
    ease-out 
    rounded-xl`;

  const blockUserActionsMutation = useBlockUserActionsMutation();
  const handleBlockActions = async (action: "block" | "un-block") => {
    blockUserActionsMutation.mutate({
      userId,
      action,
      blockIndex,
    });
  };
  return (
    <button
      type="button"
      className={`${btnStyle} ${className}`}
      onClick={() => handleBlockActions(action)}
    >
      <span>{text}</span>
    </button>
  );
};
const BlockButton = ({
  userId,
  blockIndex,
  className,
  action,
}: IBlockButtonProps) => {
  return action === "block" ? (
    <Button
      className={`text-vivid_green border border-vivid_green ${className}`}
      userId={userId}
      text={"حظر"}
      action="block"
      blockIndex={blockIndex}
    />
  ) : (
    <Button
      className={`text-vivid_green border border-vivid_green ${className}`}
      userId={userId}
      text={"الغاء الحظر"}
      action="un-block"
      blockIndex={blockIndex}
    />
  );
};

export default BlockButton;
