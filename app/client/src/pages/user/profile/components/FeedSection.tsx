import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetUserQuery } from "../../../../store/services/user";
import { IArticle } from "../../../../interfaces/global";
import {
  useGetPublisherArticlesQuery,
  useGetSavedArticlesQuery,
} from "../../../../store/services/article";
import ArticlesList from "../../../../components/ArticlesList";
import Loader from "../../../../components/Loader";
interface IProps {
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  feedSectionToShow: "published" | "saved" | "about";
}
const FeedSection = ({ setErrorMessage, feedSectionToShow }: IProps) => {
  const params = useParams();
  const username =
    (params.username && params.username.replace(/-/g, " ")) || "";
  const [page, setPage] = useState(1);
  const { data: userProfile, isSuccess } = useGetUserQuery({
    username,
  });
  const { user, isSameUser, isLoggedIn } = userProfile as any;
  const { data: publisherArticles, isLoading: areArticlesLoading } =
    useGetPublisherArticlesQuery(
      {
        publisherId: user._id,
        page,
      },
      {
        skip: !isSuccess,
      }
    );
  const { data: savedArticlesData } = useGetSavedArticlesQuery(
    {},
    { skip: feedSectionToShow === "published" ? true : false }
  );
  return (
    <div className="mt-4 p-2">
      {(!isSameUser && feedSectionToShow !== "about") || isSameUser ? (
        Number(
          feedSectionToShow === "published"
            ? publisherArticles?.articles.length
            : savedArticlesData?.savedArticles.length
        ) > 0 ? (
          <ul className="w-[100%] flex flex-col justify-center">
            {(feedSectionToShow === "published"
              ? publisherArticles?.articles || []
              : (feedSectionToShow === "saved" &&
                  savedArticlesData?.savedArticles) ||
                []
            ).map((article) => (
              <ArticlesList
                setErrorMessage={setErrorMessage}
                key={article._id}
                page={`${
                  feedSectionToShow === "published" ? "profile" : "saved-feed"
                }`}
                userSavedArticles={isSameUser ? user.saved : []}
                isLoggedIn={isLoggedIn}
                article={article}
                providedPublisher={{
                  username: user.username,
                  avatar: user.avatar || "",
                }}
              />
            ))}
            <li>
              {feedSectionToShow === "published" ||
              (page > 1 && !publisherArticles?.hasMore) ? (
                <button
                  disabled={page > 1 && !publisherArticles?.hasMore}
                  className={`${
                    publisherArticles?.articles.length === 0 && "hidden"
                  } text-sm font-bold p-2 px-4 rounded-md border-2 border-dark_green`}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  {areArticlesLoading ? <Loader /> : "حمل المزيد"}
                </button>
              ) : (
                <span className="text-sm font-bold opacity-60">
                  {feedSectionToShow === "saved"
                    ? "تم تحميل جميع المقالات المحفوظة💫"
                    : feedSectionToShow !== "about" &&
                      "تم تحميل جميع المقالات 💫"}
                </span>
              )}
            </li>
          </ul>
        ) : (
          <h3 className="w-fit opacity-70 mt-4 mx-auto">
            {isSameUser
              ? feedSectionToShow === "published"
                ? "لا توجد لديك مقالات منشورة 💫"
                : "لا توجد لديك مقالات محفوظة"
              : `${user.username} لم يقم بنشر اي مقال 💫`}
          </h3>
        )
      ) : (
        <div>..about</div>
      )}
    </div>
  );
};

export default FeedSection;
