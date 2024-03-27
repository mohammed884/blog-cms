import { useParams } from "react-router-dom";
import { useGetFollowingQuery } from "../../../../store/services/follow";
import { useGetUserQuery } from "../../../../store/services/user";
import SideBar from "../components/SideBar";
import FollowList from "../components/FollowList";
import Loader from "../../../../components/Loader";
const Following = () => {
  const { username } = useParams();
  const {
    data: userProfile,
    isSuccess,
    isLoading: isUserProfileLoading,
    isError,
    error,
  } = useGetUserQuery({ username: username?.replace(/-/g, " ") || " " });
  const {
    data: followingData,
    isLoading,
    // isError,
  } = useGetFollowingQuery(
    { id: userProfile?.user._id || "" },
    { skip: isUserProfileLoading }
  );
  if (isUserProfileLoading) return <Loader />;
  return (
    <section className="pt-[6rem]">
      <div className="w-[85%] flex justify-center mx-auto">
        <div className="flex-1">
          <h1>followings list</h1>
          <ul>
            {followingData?.following.map((follow: any) => (
              <FollowList
                isFollowingYou={follow.isFollowingYou}
                youFollowing={follow.youFollowing}
                user={follow.user}
              />
            ))}
          </ul>
        </div>
        <SideBar />
      </div>
    </section>
  );
};

export default Following;
