import { IUser } from "../../../../interfaces/global";
import { BlankUserIcon, UserAvatarIcon } from "../../../../components/Icons";
import { useGetFollowersCountQuery } from "../../../../store/services/follow";
interface IProps {
  isSameUser: boolean;
  user: IUser;
}
const SideBar = ({ user, isSameUser }: IProps) => {
  const {
    data: followersData,
    isLoading,
    isError,
  } = useGetFollowersCountQuery({ id: user._id });
  return (
    <aside className="w-[25%] p-2 pr-8 border-r border-l-gray-300 sticky">
      <div className="flex flex-col gap-4">
        <span className="w-28 h-28">
          {user.avatar ? (
            <UserAvatarIcon
              avatar={user.avatar}
              alt={`${user.username}'s Avatar`}
            />
          ) : (
            <BlankUserIcon alt={`${user.username}'s Avatar`} />
          )}
        </span>
        <div>
          <h2 className="text-xl font-bold">{user.username}</h2>
          <div className="text-[1rem] opacity-80">
            <span className="font-bold">
              {new Intl.NumberFormat("en-US", { notation: "compact" }).format(
                followersData?.count || 0
              )}
            </span>
            <span className="mr-2">متابع</span>
          </div>
          <span>{user.bio?.title}</span>
          <span>{user.bio?.text}</span>
        </div>
        {isSameUser ? (
          <button className="w-fit p-[.41rem] py-2 px-6 mt-2 text-sm text-off_white bg-yellow-900 hover:bg-yellow-800 transition-colors ease-out font-bold rounded-md">
            تعديل
          </button>
        ) : (
          <button className="w-fit p-[.41rem] py-2 px-6 mt-2 text-sm text-off_white bg-yellow-900 hover:bg-yellow-800 transition-colors ease-out font-bold rounded-md">
            متابعة
          </button>
        )}
      </div>
    </aside>
  );
};

export default SideBar;
