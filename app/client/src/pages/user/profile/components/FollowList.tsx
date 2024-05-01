import { Link } from "react-router-dom";
import { UserAvatarIcon } from "../../../../components/Icons";
import FollowButton from "../../../../components/FollowButton";
import { getUserQuery } from "../../../../services/queries/user";
interface IProps {
  follower: {
    _id: string;
    username: string;
    avatar: string;
    bio: {
      _id: string;
      text: string;
    };
  };
  isFollowingYou: boolean;
  youFollowing: boolean;
  followButtonOwnerId: string;
}
const UsersList = ({
  follower,
  followButtonOwnerId,
  isFollowingYou,
  youFollowing,
}: IProps) => {
  const { _id, username, avatar, bio } = follower;
  const viewer = getUserQuery("profile");
  return (
    <li className="flex items-center p-2 justify-between gap-2 mx-auto shadow-sm rounded-md hover:bg-stone-50 ease-out transition-colors mb-5">
      <Link to={`/user/${username}`}>
        <div className="flex items-center gap-4">
          <div>
            <span>
              <UserAvatarIcon
                width={8}
                height={8}
                avatar={avatar}
                alt={`${username}'s avatar`}
              />
            </span>
          </div>
          <div>
            <span className="text-lg font-bold hover:underline">
              {username}
            </span>
            <p className="text-[.85rem] opacity-70">{bio.text}</p>
          </div>
        </div>
      </Link>
      {viewer?.data?.user._id !== _id && (
        <FollowButton
          userId={_id}
          isFollowingYou={isFollowingYou}
          youFollowing={youFollowing}
          ownerId={followButtonOwnerId}
        />
      )}
    </li>
  );
};

export default UsersList;
