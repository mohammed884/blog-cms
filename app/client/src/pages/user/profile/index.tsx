import { useParams } from "react-router-dom";
import { useGetUserQuery } from "../../../store/services/user";
import Loader from "../../../components/Loader";
import { useState } from "react";
import { IUser } from "../../../interfaces/global";
import SideBar from "./components/SideBar";
import FeedSection from "./components/FeedSection";
import FeedOptions from "./components/FeedOptions";
import Error from "../../../components/Error";
import ProfileHeader from "./components/ProfileHeader";
const Profile = () => {
  //bug i need to clear the cache when the username changes
  const [errorMessage, setErrorMessage] = useState("");
  const [feedSectionToShow, setFeedSectionToShow] = useState<
    "published" | "saved" | "about"
  >("published");
  const { username } = useParams();
  const {
    data: userProfile,
    isSuccess,
    isLoading,
    isError,
    error,
  } = useGetUserQuery({ username: username?.replace(/-/g, " ") || " " });
  if (isLoading) return <Loader />;
  if (isError) setErrorMessage((error as any)?.message);
  const {
    user,
    isSameUser,
  }: { user: IUser; isSameUser: boolean; isLoggedIn: boolean } =
    userProfile as any;
  return (
    <section className="pt-[6.4rem]">
      <Error message={errorMessage} setErrorMessage={setErrorMessage} />
      <div className="w-[85%] flex justify-center mx-auto">
        <div className="flex-1">
          <ProfileHeader
            email={user.email}
            username={user.username}
            isConfirmed={user.confirmed}
            isSameUser={isSameUser}
          />
          <FeedOptions
            isSameUser={isSameUser}
            feedSectionToShow={feedSectionToShow}
            setFeedSectionToShow={setFeedSectionToShow}
          />
          <FeedSection
            setErrorMessage={setErrorMessage}
            feedSectionToShow={feedSectionToShow}
          />
        </div>
        <SideBar />
      </div>
    </section>
  );
};

export default Profile;
