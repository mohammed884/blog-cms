import TopicList from "../../../components/TopicList";
import ArticlesList from "../../../components/ArticlesList";
import { IArticle, ITopic } from "../../../interfaces/global";
import { Link } from "react-router-dom";
import LoadMoreBtn from "../../../components/LoadMoreBtn";
interface IProps {
  feed: Array<{ success: boolean; articles: Array<IArticle> }>;
  topics: Array<ITopic>;
  dialogRef?: React.RefObject<HTMLDialogElement | null>;
  fetchNextPage: any;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}
const FeedSection = ({
  feed,
  topics,
  dialogRef,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: IProps) => {
  return (
    <section className="w-full h-fit text-right xl:mt-10 sm:mt-7 p-2">
      <div className="flex xl:flex-row lg:justify-between sm:flex-col-reverse lg:gap-2 mx-auto">
        <ul className="flex-grow">
          {feed.map((page) =>
            page.articles.map((article) => (
              <ArticlesList
                page="feed"
                dialogRef={dialogRef}
                key={article._id}
                article={article}
              />
            ))
          )}
          <li>
            {!hasNextPage ? (
              <span className="text-sm font-bold opacity-60">
                تم تحميل جميع المقالات 💫
              </span>
            ) : (
              <LoadMoreBtn
                fetchNextPage={fetchNextPage}
                hasMore={hasNextPage}
                isDataLoading={isFetchingNextPage}
                btnStyle="ml-auto"
                messageStyle="mt-2 pr-4"
              />
            )}
          </li>
        </ul>
        <aside className="xl:w-[36%] sm:w-[90] h-fit xl:sticky md:mt-2 sm:mb-8 top-[5.25rem]">
          <h2 className="text-[1.2rem] font-extrabold">اكتشف ما تهواه نفسك</h2>
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
    </section>
  );
};

export default FeedSection;
