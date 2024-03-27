import { Link, useParams } from "react-router-dom";
import { UserAvatarIcon } from "../../../../components/Icons";
import {
  useGetFollowersCountQuery,
  useGetFollowingQuery,
} from "../../../../store/services/follow";
import { useGetUserQuery } from "../../../../store/services/user";
import FollowButton from "../../../../components/FollowButton";
import Loader from "../../../../components/Loader";
import { Ellipsis } from "../../../../components/Icons";
import { useState } from "react";
interface IFollowingListProps {
  user: {
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
  isSameUser: boolean;
}
const SideBar = () => {
  const params = useParams();
  const username = params.username?.replace(/-/g, " ") || " ";
  const { data: profileViewer, isLoading: isProfileViewerLoading } =
    useGetUserQuery({
      username: "profile",
    });
  const { data: userProfile, isLoading: isUserProfileLoading } =
    useGetUserQuery({
      username,
    });
  const { data: followersCount, isLoading: isFollowersCountLoading } =
    useGetFollowersCountQuery(
      { id: userProfile?.user._id || "" },
      { skip: isUserProfileLoading }
    );
  const {
    data: followingData,
    isLoading,
    // isError,
  } = useGetFollowingQuery(
    { id: userProfile?.user._id || "" },
    { skip: isUserProfileLoading }
  );
  if (isUserProfileLoading || isProfileViewerLoading || isFollowersCountLoading)
    return <Loader />;
  const { user, isSameUser, isFollowingYou, youFollowing } = userProfile as any;
  return (
    <aside className="w-[28%] p-2 pr-12 border-r border-l-gray-300 sticky">
      <div className="flex flex-col gap-4">
        <span className="w-28 h-28">
          <UserAvatarIcon
            avatar={user.avatar}
            alt={`${user.username}'s Avatar`}
          />
        </span>
        <div>
          <h2 className="text-[1.2rem] font-bold mb-2">{user.username}</h2>
          <Link
            to={`/user/${username}/followers`}
            className="text-[.85rem] opacity-60 hover:underline"
          >
            <span className="font-bold">
              {new Intl.NumberFormat("en-US", { notation: "compact" }).format(
                followersCount?.count || 0
              )}
            </span>
            <span className="mr-2">
              {Number(followersCount?.count) <= 1 ? "متابع" : "متابعين"}
            </span>
          </Link>
          <span>{user.bio?.title}</span>
          <span>{user.bio?.text}</span>
        </div>
        {isSameUser ? (
          <Link
            to={`/user/edit`}
            className="w-fit text-[.8rem] text-dark_green hover:underline transition-colors ease-out font-bold rounded-md"
          >
            تعديل الحساب
          </Link>
        ) : (
          <FollowButton
            id={user._id}
            youFollowing={youFollowing}
            isFollowingYou={isFollowingYou}
          />
        )}
        <div className="mt-3">
          <div>
            <Link
              to={`/user/${username}/following`}
              className="font-semibold text-[1.1rem]"
            >
              <span>{isSameUser ? "اتابع" : "يتابع"}</span>
            </Link>
          </div>
          <ul className="mb-4">
            {followingData?.following.map((follow: any) => (
              <FollowingList
                key={follow.user._id}
                isFollowingYou={follow.isFollowingYou}
                youFollowing={follow.youFollowing}
                user={follow.user}
                isSameUser={profileViewer?.user._id === follow.user._id}
              />
            ))}
          </ul>
          <Link
            to={`/user/${username}/following`}
            className="text-[.75rem] opacity-75 hover:underline"
          >
            (مشاهدة الجميع)
          </Link>
        </div>
      </div>
    </aside>
  );
};
const FollowingList = ({
  user,
  isFollowingYou,
  youFollowing,
  isSameUser,
}: IFollowingListProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { _id, username, avatar, bio } = user;
  return (
    <li className="w-[90%] flex items-center justify-between gap-2 pt-2">
      <Link to={`/user/${username}`}>
        <div className="flex items-center gap-2">
          <span>
            <UserAvatarIcon
              width={6}
              height={6}
              avatar={avatar}
              alt={`${username}'s avatar`}
            />
          </span>
          <div>
            <span className="text-[.8rem] opacity-60 hover:underline">
              {username}
            </span>
          </div>
        </div>
      </Link>
      <div className="relative">
        <div
          className={`w-[14rem] h-[10rem] bg-off_white flex flex-col justify-between p-2 pt-3 rounded-sm shadow-md absolute bottom-9 left-[50%] translate-x-[-50%] ${
            !isDetailsOpen && "hidden"
          }`}
        >
          <div className="flex items-center gap-2">
            <UserAvatarIcon
              width={6}
              height={6}
              avatar={avatar}
              alt={`${username}'s avatar`}
            />
            <Link
              to={`/user/${username}/following`}
              className="text-md font-semibold hover:underline"
            >
              {username}
            </Link>
            <p>{bio.text}</p>
          </div>
          <div>
            <FollowButton
              id={_id}
              youFollowing={youFollowing}
              isFollowingYou={isFollowingYou}
              className={`font-normal text-[.8rem] py-1 ${
                isSameUser && "hidden"
              }`}
            />
          </div>
        </div>
        <button
          onClick={() => setIsDetailsOpen((prev) => !prev)}
          className={`p-2 hover:bg-gray-200 rounded-md`}
        >
          <Ellipsis width={4} height={4} />
        </button>
      </div>
    </li>
  );
};
export default SideBar;
