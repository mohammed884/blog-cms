import { useParams } from "react-router-dom";
import SideBar from "../components/SideBar";
import FollowList from "../components/FollowList";
import Loader from "../../../../components/Loader";
import UserLocation from "../components/UserBreadcrumb";
import LoadMoreBtn from "../../../../components/LoadMoreBtn";
import { getUserQuery } from "../../../../services/queries/user";
import {
  getFollowingCountQuery,
  getFollowingQuery,
} from "../../../../services/queries/follow";
const Following = () => {
  const params = useParams();
  const username = params.username?.replace(/-/g, " ") || " ";
  const userProfile = getUserQuery(username);
  const following = getFollowingQuery(userProfile.data?.user._id || "");
  const followingCount = getFollowingCountQuery(
    userProfile.data?.user._id || ""
  );
  if (userProfile.isLoading || followingCount.isLoading || following.isLoading)
    return <Loader />;
  // const { user, isSameUser } = userProfile as any;
  return (
    <section className="pt-[6rem]">
      <div className="w-[90%] flex justify-center mx-auto">
        <div className="flex-1">
          <div className="flex flex-col justify-center w-[90%] mx-auto">
            <div>
              <UserLocation location="المتابعون" />
              <div className="flex gap-2 items-center borderb border-b-gray-300 pb-3">
                <h1 className="text-[1.7rem] font-black mt-2">
                  {userProfile.data?.isSameUser
                    ? "قائمة المتابعون"
                    : `المتابعون ${userProfile.data?.user.username}`}
                </h1>
                <span className="text-[1.5rem] font-semibold mt-3">
                  {followingCount?.data?.count}
                </span>
              </div>
            </div>
            <ul className="mt-4">
              {following.data?.pages.map((page) =>
                page.following.map((follow) => (
                  <FollowList
                    followButtonOwnerId={userProfile.data?.user._id || ""}
                    key={follow.followedBy}
                    isFollowingYou={follow.isFollowingYou}
                    youFollowing={follow.youFollowing}
                    follower={follow.user}
                  />
                ))
              )}
            </ul>
            <LoadMoreBtn
              fetchNextPage={following.fetchNextPage}
              hasMore={following.hasNextPage}
              isDataLoading={following.isFetchingNextPage}
              messageAfterFetchingAllData="تم تحميل جميع المتابعين ⚡"
              btnStyle="ml-auto"
              messageStyle="mt-2 pr-4"
            />
          </div>
        </div>
        <SideBar />
      </div>
    </section>
  );
};

export default Following;
