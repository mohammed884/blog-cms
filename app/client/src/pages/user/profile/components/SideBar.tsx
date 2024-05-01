import { Link, useParams } from "react-router-dom";
import { UserAvatarIcon } from "../../../../components/Icons";
import {
  getFollowersCountQuery,
  getFollowingQuery,
} from "../../../../services/queries/follow";
import { getUserQuery } from "../../../../services/queries/user";
import FollowButton from "../../../../components/FollowButton";
import Loader from "../../../../components/Loader";
import { Ellipsis } from "../../../../components/Icons";
import { useState } from "react";
import { useEffect } from "react";
import { IFollowing } from "../../../../interfaces/global";
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
  followButtonOwnerId: string;
}
const SideBar = () => {
  const params = useParams();
  const username = params.username?.replace(/-/g, " ") || " ";
  const userProfile = getUserQuery(username);
  const followersCountData = getFollowersCountQuery(
    userProfile?.data?.user._id || ""
  );
  const following = getFollowingQuery(userProfile?.data?.user._id || "");
  if (!userProfile) return <Loader />;
  const user = userProfile?.data?.user;
  const isSameUser = userProfile.data?.isSameUser;
  return (
    <aside className="w-[28%] p-2 pr-12 border-r border-l-gray-300 sticky">
      <div className="flex flex-col gap-4">
        <span className="w-28 h-28">
          <UserAvatarIcon
            avatar={user?.avatar}
            alt={`${user?.username}'s Avatar`}
          />
        </span>
        <div>
          <h2 className="text-[1.2rem] font-bold mb-2">{user?.username}</h2>
          <Link
            to={`/user/${username}/followers`}
            className="text-[.85rem] opacity-60 hover:underline"
          >
            <span className="font-bold">
              {new Intl.NumberFormat("en-US", { notation: "compact" }).format(
                followersCountData?.data?.count || 0
              )}
            </span>
            <span className="mr-2">
              {Number(followersCountData?.data?.count) <= 1
                ? "متابع"
                : "متابعين"}
            </span>
          </Link>
          <span>{user?.bio?.title}</span>
          <span>{user?.bio?.text}</span>
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
            userId={user?._id || ""}
            ownerId={user?._id || ""}
            youFollowing={!!userProfile?.data?.youFollowing}
            isFollowingYou={!!userProfile?.data?.isFollowingYou}
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
            {following.data?.pages[0].following.map((follow: IFollowing) => (
              <FollowingList
                followButtonOwnerId={user?._id || ""}
                key={follow.user._id}
                user={follow.user}
                isFollowingYou={follow.isFollowingYou}
                youFollowing={follow.youFollowing}
                isSameUser={!!isSameUser}
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
  followButtonOwnerId,
  isFollowingYou,
  youFollowing,
  isSameUser,
}: IFollowingListProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { _id, username, avatar, bio } = user;
  const handleCloseDetails = (e: any) => {
    if (isDetailsOpen) return;
    const targetParent = e.target.closest(`#details-container-${_id}`);
    if (!targetParent) setIsDetailsOpen(false);
  };
  useEffect(() => {
    window.document.body.addEventListener("click", handleCloseDetails);
    return () =>
      window.document.body.removeEventListener("click", handleCloseDetails);
  }, []);
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
      <div id={`details-container-${_id}`} className="relative">
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
              userId={_id}
              ownerId={followButtonOwnerId}
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
