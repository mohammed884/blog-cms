import SideBar from "../components/SideBar";
import Loader from "../../../../components/Loader";
import UserLocation from "../components/UserBreadcrumb";
import { UserAvatarIcon } from "../../../../components/Icons";
import {
  getBlockedUsersQuery,
  getUserQuery,
} from "../../../../services/queries/user";
import BlockButton from "../components/BlockButton";
import { IBlockedUser } from "../../../../interfaces/global";
interface IBlockedList {
  blockedUser: IBlockedUser;
  index: number;
}
const Blocked = () => {
  const userProfile = getUserQuery("profile");
  const blocked = getBlockedUsersQuery();
  if (userProfile.isLoading || blocked.isLoading) return <Loader />;
  return (
    <section className="pt-[6rem]">
      <div className="w-[90%] flex justify-center mx-auto">
        <div className="flex-1">
          <div className="flex flex-col justify-center w-[90%] mx-auto">
            <div>
              <UserLocation
                providedUsername={userProfile.data?.user.username}
                location="قائمة المحظورين"
              />
              <div className="flex gap-2 items-center borderb border-b-gray-300 pb-3">
                <h1 className="text-[1.7rem] font-black mt-2">
                  {userProfile.data?.isSameUser
                    ? "المحظورين"
                    : `المحظورين ${userProfile.data?.user.username}`}
                </h1>
                <span className="text-[1.5rem] font-semibold mt-3">
                  {blocked?.data?.blockedUsers.length}
                </span>
              </div>
            </div>
            <ul className="mt-4">
              {blocked.data?.blockedUsers?.map((blockedUser, index) => (
                <BlockedList
                  index={index}
                  blockedUser={blockedUser}
                  key={blockedUser._id}
                />
              ))}
            </ul>
          </div>
        </div>
        <SideBar />
      </div>
    </section>
  );
};
const BlockedList = ({ blockedUser, index }: IBlockedList) => {
  const { _id, username, avatar } = blockedUser;
  return (
    <li className="flex items-center p-2 justify-between gap-2 mx-auto shadow-sm rounded-md hover:bg-stone-50 ease-out transition-colors mb-5">
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
          <span className="text-lg font-bold hover:underline">{username}</span>
          {/* <p className="text-[.85rem] opacity-70">{bio.text}</p> */}
        </div>
      </div>
      <BlockButton blockIndex={index} userId={_id} action="un-block" />
    </li>
  );
};
export default Blocked;
