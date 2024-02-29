import { useState } from "react";
import { IArticle, IUser } from "../../../../interfaces/global";
import { useGetPublisherArticlesQuery } from "../../../../store/services/article";
import ArticlesList from "../../../../components/ArticlesList";
import Loader from "../../../../components/Loader";
interface IProps {
  user: IUser;
  skip: boolean;
  isLoggedIn: boolean;
  isSameUser: boolean;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}
const FeedSection = ({
  user,
  skip,
  isLoggedIn,
  isSameUser,
  setErrorMessage,
}: IProps) => {
  const [page, setPage] = useState(1);
  const {
    data: publisherArticles,
    isLoading: areArticlesLoading,
    isError: articlesError,
  } = useGetPublisherArticlesQuery<{
    data: { articles: Array<IArticle>; isSuccess: boolean; hasMore?: boolean };
    isLoading: boolean;
    isError: boolean;
  }>(
    {
      publisherId: user._id,
      page,
    },
    {
      skip,
    }
  );
  return (
    <div className="mt-4 p-2">
      {Number(publisherArticles?.articles.length) > 0 ? (
        <>
          <ul className="w-[100%] flex flex-col justify-center">
            {publisherArticles?.articles.map((article) => (
              <ArticlesList
                setErrorMessage={setErrorMessage}
                key={article._id}
                page="profile"
                isLoggedIn={isLoggedIn}
                article={article}
                articlePublisher={{
                  username: user.username,
                  avatar: user.avatar || "",
                }}
              />
            ))}
            <li>
              {page > 1 && !publisherArticles?.hasMore ? (
                <span className="text-sm font-bold opacity-60">
                  تم تحميل جميع المقالات 💫
                </span>
              ) : (
                <button
                  disabled={page > 1 && !publisherArticles?.hasMore}
                  className={`${
                    publisherArticles?.articles.length === 0 && "hidden"
                  } text-sm font-bold p-2 px-4 rounded-md border-2 border-dark_green`}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  {areArticlesLoading ? <Loader /> : "حمل المزيد"}
                </button>
              )}
            </li>
          </ul>
        </>
      ) : (
        <h3 className="opacity-70 mt-4">
          {isSameUser
            ? "لا توجد لديك مقالات منشورة 💫"
            : `${user.username} لم يقم بنشر اي مقال 💫`}
        </h3>
      )}
    </div>
  );
};

export default FeedSection;
