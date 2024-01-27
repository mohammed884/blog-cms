import TopicsList from "../../../components/TopicsList";
import ArticlesList from "../../../components/ArticlesList";
import { IArticle, ITopic } from "../../../interfaces/global";
import { Link } from "react-router-dom";
interface IProps {
  feed: Array<IArticle>;
  topics: Array<ITopic>;
  dialogRef?: React.RefObject<HTMLDialogElement | null>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  hasMore: boolean;
}
const ArticlesSection = ({
  feed,
  topics,
  dialogRef,
  page,
  hasMore,
  setPage,
}: IProps) => {
  return (
    <section className="w-full h-fit text-right xl:mt-10 sm:mt-7 p-2">
      <div className="xl:w-[80%] lg:w-[88%] sm:w-[95%] flex xl:flex-row sm:flex-col-reverse lg:justify-between mx-auto">
        <ul>
          {feed.map((article) => (
            <ArticlesList
              dialogRef={dialogRef}
              key={article._id}
              article={article}
            />
          ))}
          <li>
            <button
              disabled={page > 1 && !hasMore}
              className={`${feed.length === 0 && "hidden"}`}
              onClick={() => setPage((prev) => prev + 1)}
            >
              load more
            </button>
          </li>
        </ul>
        <aside className="xl:w-[38%] sm:w-[90] h-fit xl:sticky md:mt-2 sm:mb-8 top-[5.25rem]">
          <h2 className="text-[1.4rem] font-bold">اكتشف ما تهواه نفسك</h2>
          <ul className="w-fit flex flex-wrap gap-3 mt-4">
            {topics.map((topic) => (
              <TopicsList key={topic._id} topic={topic.title} />
            ))}
          </ul>
          <div className="mt-8">
            <Link to="/topics" className="text-dark_green hover:underline">
              شاهد المزيد من المواضيع
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default ArticlesSection;
