import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/Loader";
import { useState } from "react";
import { IUser } from "../../../interfaces/global";
import SideBar from "./components/SideBar";
import FeedSection from "./components/FeedSection";
import FeedOptions from "./components/FeedOptions";
import Error from "../../../components/Error";
import ProfileHeader from "./components/ProfileHeader";
import { getUserQuery } from "../../../services/queries/user";
const Profile = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [feedSectionToShow, setFeedSectionToShow] = useState<
    "published" | "saved" | "about"
  >("published");
  const params = useParams();
  const username = params.username?.replace(/-/g, " ") || " ";
  const userData = getUserQuery(username);
  if (userData.isLoading) return <Loader />;
  if (userData.isError) {
    navigate("/user/blocked");
    setErrorMessage((userData.error as any)?.message);
    return <div>error</div>;
  }
  const user = userData?.data?.user as IUser;
  const isSameUser = userData.data?.isSameUser as boolean;
  return (
    <section className="pt-[6.4rem]">
      <Error message={errorMessage} setErrorMessage={setErrorMessage} />
      <div className="w-[90%] flex justify-center mx-auto">
        <div className="flex-1">
          <div className="flex flex-col justify-center w-[95%] mx-auto">
            <ProfileHeader
              userId={user?._id}
              email={user?.email}
              username={user?.username}
              isConfirmed={user?.confirmed}
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
        </div>
        <SideBar />
      </div>
    </section>
  );
};

export default Profile;
