import { useRef } from "react";
import { getFeedQuery } from "../../services/queries/article";
import ArticleList from "../../components/ArticlesList";
import TopicList from "../../components/TopicList";
import LoadMoreBtn from "../../components/LoadMoreBtn";
import { Link } from "react-router-dom";
import { getUserQuery } from "../../services/queries/user";
const Feed = () => {
  const userProfile = getUserQuery("profile");
  const feed = getFeedQuery();
  const LoginPopupRef = useRef<HTMLDialogElement>(null);
  const topics = [
    {
      _id: "1",
      title: "علوم",
    },
    {
      _id: "2",
      title: "برمجة",
    },
    {
      _id: "3",
      title: "تكنولوجيا",
    },
    {
      _id: "4",

      title: "تعليم",
    },
    {
      _id: "5",
      title: "تصميم",
    },
    {
      _id: "6",
      title: "تصميم داخلي",
    },
  ];
  return (
    <section className="pt-[5rem]">
      <div className="xl:w-[85%] lg:w-[92%] md:w-[85%] sm:w-[90%] mx-auto">
        <aside className="xl:w-[57%] p-2 rounded-md sm:w-[90] h-fit md:mt-2 sm:mb-8 top-[5.25rem]">
          <h1 className="text-[1.2rem] font-extrabold">اهتمامتك</h1>
          <ul className="w-fit flex flex-wrap gap-3 mt-3">
            {topics.map((topic) => (
              <TopicList key={topic._id} topic={topic.title} />
            ))}
          </ul>
        </aside>
        <div className="w-full h-fit text-right xl:mt-10 sm:mt-7 p-2">
          <div className="flex lg:justify-between lg:gap-2 mx-auto">
            <ul className="w-[100%] flex-grow">
              {feed.data?.pages.map((page) =>
                page.articles.map((article) => (
                  <ArticleList
                    page="feed"
                    dialogRef={LoginPopupRef}
                    key={article._id}
                    article={article}
                    width="md:w-[80%] lg:w-[92%] md:mx-auto lg:mx-0"
                    userSavedArticles={userProfile.data?.user.saved || []}
                    isLoggedIn={true}
                  />
                ))
              )}
              <li className="md:w-[80%] lg:w-[92%] sm:mx-auto lg:mx-0">
                {!feed.hasNextPage ? (
                  <span className="text-sm font-bold opacity-60">
                    تم تحميل جميع المقالات 💫
                  </span>
                ) : (
                  <LoadMoreBtn
                    fetchNextPage={feed.fetchNextPage}
                    hasMore={feed.hasNextPage}
                    isDataLoading={feed.isFetchingNextPage}
                    btnStyle="ml-auto"
                    messageStyle="mt-2 pr-4"
                  />
                )}
              </li>
            </ul>
            <aside className="xl:w-[36%] lg:w-[45%] sm:hidden lg:inline h-fit xl:sticky md:mt-2 sm:mb-8 top-[5.25rem]">
              <h2 className="text-[1.2rem] font-extrabold">
                اكتشف ما تهواه نفسك
              </h2>
              <ul className="w-fit flex flex-wrap gap-3 mt-4">
                {topics.map((topic) => (
                  <TopicList key={topic._id} topic={topic.title} />
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  to="/topics"
                  className="text-sm opacity-75 text-dark_green hover:underline"
                >
                  شاهد المزيد من المواضيع
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feed;
