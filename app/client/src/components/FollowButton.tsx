import { useFollowUserMutation } from "../store/services/follow";
import { FollowIcon } from "./Icons";

interface IFollowButtonProps {
  isFollowingYou: boolean;
  youFollowing: boolean;
  id: string;
  className?: string;
}
interface IButtonProps {
  id: string;
  text: "متابعة" | "رد المتابعة" | "اتابع";
  action: "follow" | "un-follow";
  className?: string;
}
const Button = ({ id, text, action, className }: IButtonProps) => {
  const btnStyle = `w-fit 
    flex 
    gap-2 
    text-[.8rem] 
    p-[.41rem] 
    py-2 
    px-6 
    mt-2 
    transition-colors 
    ease-out 
    rounded-xl`;

  const [follow] = useFollowUserMutation();
  const handleFollow = async (action: "follow" | "un-follow") => {
    await follow({ id, action })
      .unwrap()
      .then((fulfilled) => console.log(fulfilled))
      .catch((reason) => console.log(reason));
  };
  return (
    <button
      type="button"
      className={`${btnStyle} ${className}`}
      onClick={() => handleFollow(action)}
    >
      <span>{text}</span>
      {/* <span>
        <FollowIcon width={4} height={4} />
      </span> */}
    </button>
  );
};
const FollowButton = ({
  isFollowingYou,
  youFollowing,
  id,
  className,
}: IFollowButtonProps) => {
  return youFollowing ? (
    <Button
      className={`text-vivid_green border border-vivid_green ${className}`}
      id={id}
      text={"اتابع"}
      action="un-follow"
    />
  ) : isFollowingYou ? (
    <Button
      className={` text-white bg-vivid_green hover:bg-[#187e15] ${className}`}
      id={id}
      text={"رد المتابعة"}
      action="follow"
    />
  ) : (
    <Button
      className={`bg-vivid_green hover:bg-green-50 ${className}`}
      id={id}
      text={"متابعة"}
      action="follow"
    />
  );
};

export default FollowButton;
