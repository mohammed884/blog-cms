import ArticleList from "../../components/ArticlesList";
import LoadMoreBtn from "../../components/LoadMoreBtn";
import { IArticle } from "../../interfaces/global";
interface IProps {
  feed: Array<{ success: boolean; articles: Array<IArticle> }>;
  dialogRef?: React.RefObject<HTMLDialogElement | null>;
  fetchNextPage: any;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}
const FeedSection = ({
  feed,
  dialogRef,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: IProps) => {
  return (
    <ul className="flex-grow">
      {feed.map((page) =>
        page.articles.map((article) => (
          <ArticleList
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
  );
};

export default FeedSection;
