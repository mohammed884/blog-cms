import { useParams } from "react-router-dom";
import { useFollowMutation } from "../services/queries/follow";
interface IFollowButtonProps {
  isFollowingYou: boolean;
  youFollowing: boolean;
  className?: string;
  userId: string;
  ownerId: string;
}
interface IButtonProps {
  userId: string;
  text: "متابعة" | "رد المتابعة" | "اتابع";
  action: "follow" | "un-follow";
  className?: string;
  ownerId: string;
}
const Button = ({ userId, ownerId, text, action, className }: IButtonProps) => {
  const params = useParams();
  const ownerUsername = params?.username?.replace(/-/g, " ");
  console.log(params);

  const btnStyle = ` 
    text-[.8rem] 
    p-[.41rem] 
    py-2 
    px-6 
    transition-colors 
    ease-out 
    rounded-xl`;

  const followUserMutation = useFollowMutation();
  const handleFollow = async (action: "follow" | "un-follow") => {
    followUserMutation.mutate({
      userId,
      action,
      ownerId,
      ownerUsername: ownerUsername || "",
    });
  };
  return (
    <button
      type="button"
      className={`${btnStyle} ${className}`}
      onClick={() => handleFollow(action)}
    >
      <span>{text}</span>
    </button>
  );
};
const FollowButton = ({
  isFollowingYou,
  youFollowing,
  userId,
  className,
  ownerId,
}: IFollowButtonProps) => {
  console.log(ownerId);

  return youFollowing ? (
    <Button
      className={`text-vivid_green border border-vivid_green ${className}`}
      userId={userId}
      text={"اتابع"}
      action="un-follow"
      ownerId={ownerId}
    />
  ) : isFollowingYou ? (
    <Button
      className={` text-white bg-vivid_green hover:bg-[#187e15] ${className}`}
      userId={userId}
      text={"رد المتابعة"}
      action="follow"
      ownerId={ownerId}
    />
  ) : (
    <Button
      className={`bg-vivid_green hover:bg-green-50 ${className}`}
      userId={userId}
      text={"متابعة"}
      action="follow"
      ownerId={ownerId}
    />
  );
};

export default FollowButton;
