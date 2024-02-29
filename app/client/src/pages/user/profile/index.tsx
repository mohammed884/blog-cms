import { useParams } from "react-router-dom";
import {
  useGetUserQuery,
  userProfileSelector,
} from "../../../store/services/user";
import Loader from "../../../components/Loader";
import { useState } from "react";
import { useAppSelector } from "../../../store/hooks";
import { AlertIcon, Ellipsis } from "../../../components/Icons";
import { IUser } from "../../../interfaces/global";
import SideBar from "./components/SideBar";
import FeedSection from "./components/FeedSection";
import FeedOptions from "./components/FeedOptions";
import Error from "../../../components/Error";
const Profile = () => {
  //bug i need to clear the cache when the username changes
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [articlesTypeToShow, setArticlesTypeToShow] = useState<
    "published" | "saved"
  >("published");
  const { username } = useParams();
  const { data: selectUserProfile, isSuccess: selectUserProfileSuccess } =
    useAppSelector<{ data: { user: IUser }; isSuccess: boolean }>(
      userProfileSelector
    );
  const isSameUser =
    username?.replace(/-/g, " ") === selectUserProfile?.user.username;
  const {
    data: userProfile,
    isSuccess,
    isLoading,
    isError,
    error,
  } = useGetUserQuery(
    { username: username?.replace(/-/g, " ") },
    { skip: isSameUser }
  );
  if (isLoading) return <Loader />;
  if (isError) setErrorMessage((error as any)?.message);
  console.log("user profile ->", userProfile);

  const { user }: { user: IUser } = isSameUser
    ? selectUserProfile
    : userProfile;

  return (
    <section className="pt-[6rem]">
      <Error message={errorMessage} setErrorMessage={setErrorMessage} />
      <div className="w-[85%] flex justify-center mx-auto">
        <div className="flex-1">
          <div className="w-[100%] flex justify-between items-center pr-4 pl-4 gap-8">
            <h1 className="text-4xl font-bold">{user.username}</h1>
            <div className="w-5 h-8">
              <Ellipsis />
            </div>
          </div>
          {isSameUser && !user.confirmed && (
            <div className="w-[90%] h-fit flex items-center gap-2 bg-yellow-50 text-md font-medium rounded-md mx-auto mt-4">
              <div className="py-2 w-2 h-full rounded-r-md bg-yellow-400 text-yellow-400">
                0
              </div>
              <div className="flex items-center gap-[.35rem] text-[.9rem]">
                <span>
                  تنبيه ! الرجاء تاكيد الحساب لاستخدام كامل الميزات المتاحة في
                  المنصة
                </span>
                <AlertIcon width={4} height={4} />
              </div>
            </div>
          )}
          <FeedOptions
            isSameUser={isSameUser}
            articlesTypeToShow={articlesTypeToShow}
            setArticlesTypeToShow={setArticlesTypeToShow}
          />
          <FeedSection
            user={user}
            isLoggedIn={selectUserProfile?.user ? true : false}
            skip={isSameUser ? !selectUserProfileSuccess : !isSuccess}
            isSameUser={isSameUser}
            setErrorMessage={setErrorMessage}
          />
        </div>
        <SideBar user={user} isSameUser={isSameUser} />
      </div>
    </section>
  );
};

export default Profile;
