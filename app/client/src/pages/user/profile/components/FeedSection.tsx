import { useRef } from "react";
import { useParams } from "react-router-dom";
import ArticlesList from "../../../../components/ArticlesList";
import LoadMoreBtn from "../../../../components/LoadMoreBtn";
import { getUserQuery } from "../../../../services/queries/user";
import {
  getPublisherArticlesQuery,
  getSavedArticlesQuery,
} from "../../../../services/queries/article";
import Loader from "../../../../components/Loader";
import LoginPopup from "../../../../components/LoginPopup";
interface IProps {
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  feedSectionToShow: "published" | "saved" | "about";
}
const FeedSection = ({ setErrorMessage, feedSectionToShow }: IProps) => {
  const params = useParams();
  const LoginPopupRef = useRef<HTMLDialogElement>(null);
  const username = params.username?.replace(/-/g, " ") || "";
  const userProfile = getUserQuery(username);
  if (userProfile.isLoading) return <Loader />;
  if (userProfile.error) {
    console.log(userProfile.error);

    return <div>error</div>;
  }
  const publisherArticles = getPublisherArticlesQuery(
    userProfile.data?.user?._id || ""
  );
  const savedArticles = getSavedArticlesQuery(
    feedSectionToShow === "saved" ? true : false
  );
  const user = userProfile.data?.user;
  const isSameUser = userProfile.data?.isSameUser;
  const isLoggedIn = userProfile.data?.isLoggedIn;
  return (
    <div className="mt-4 p-2">
      <LoginPopup ref={LoginPopupRef} />
      {(!isSameUser && feedSectionToShow !== "about") || isSameUser ? (
        feedSectionToShow === "published" || feedSectionToShow === "saved" ? (
          <ul className="w-[100%] flex flex-col justify-center">
            {feedSectionToShow === "published"
              ? publisherArticles?.data?.pages.map((page) =>
                  page.articles.map((article) => (
                    <ArticlesList
                      dialogRef={LoginPopupRef}
                      setErrorMessage={setErrorMessage}
                      key={article._id}
                      page={`${
                        feedSectionToShow === "published"
                          ? "profile"
                          : "saved-feed"
                      }`}
                      className="xl:w-[90%] lg:w-[70%]"
                      userSavedArticles={isSameUser ? user?.saved : []}
                      isLoggedIn={isLoggedIn}
                      article={article}
                      providedPublisher={{
                        _id: user?._id || "",
                        username: user?.username || "",
                        avatar: user?.avatar || "",
                      }}
                    />
                  ))
                )
              : feedSectionToShow === "saved" &&
                savedArticles?.data?.articles.map((article) => (
                  <ArticlesList
                    dialogRef={LoginPopupRef}
                    setErrorMessage={setErrorMessage}
                    key={article._id}
                    page={"saved-feed"}
                    className="xl:w-[90%] lg:w-[70%]"
                    userSavedArticles={isSameUser ? user?.saved : []}
                    isLoggedIn={isLoggedIn}
                    article={article}
                    providedPublisher={{
                      _id: user?._id || "",
                      username: user?.username || "",
                      avatar: user?.avatar || "",
                    }}
                  />
                ))}
            <li>
              {feedSectionToShow === "published" &&
              publisherArticles.hasNextPage ? (
                <LoadMoreBtn
                  fetchNextPage={publisherArticles.fetchNextPage}
                  hasMore={publisherArticles.hasNextPage}
                  isDataLoading={publisherArticles.isFetchingNextPage}
                  messageAfterFetchingAllData="تم تحميل جميع المقالات ⚡"
                  btnStyle="ml-auto"
                  messageStyle="mt-2 pr-4"
                />
              ) : (
                <span className="text-sm font-bold opacity-60">
                  {feedSectionToShow === "saved"
                    ? "تم تحميل جميع المقالات المحفوظة💫"
                    : "تم تحميل جميع المقالات 💫"}
                </span>
              )}
            </li>
          </ul>
        ) : (
          <h3 className="w-fit opacity-70 mt-4 mx-auto">
            {isSameUser
              ? publisherArticles.data?.pages.length
                ? "لا توجد لديك مقالات محفوظة"
                : savedArticles.data?.articles.length &&
                  "لا توجد لديك مقالات منشورة 💫"
              : `${user?.username} لم يقم بنشر اي مقال 💫`}
          </h3>
        )
      ) : (
        <div>..about</div>
      )}
    </div>
  );
};

export default FeedSection;
