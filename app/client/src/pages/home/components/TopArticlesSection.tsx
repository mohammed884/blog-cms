import { IArticle } from "../../../interfaces/global";
import TopArticlesList from "./TopArticlesList";
interface IProps {
  articles: Array<IArticle>;
}
const TopArticlesSection = ({ articles }: IProps) => {
  return (
    <section className="w-full mx-auto border-b-[1px] border-b-gray-300 h-fit text-right mt-7 p-2">
      <div className="flex">
        <h2 className="text-[1.4rem] font-bold ml-3">مقالات رائجة</h2>
        <img
          className="w-7 h-7"
          src="../../../../public/svgs/trending-up.svg"
          alt="trending up svg"
        />
      </div>
      <ul className="grid md:grid-cols-3 sm:grid-cols-1 xl:gap-10 md:gap-8 sm:gap-0 mt-7">
        {articles.map((article, index) => (
          <TopArticlesList key={article._id} index={index} article={article} />
        ))}
      </ul>
    </section>
  );
};

export default TopArticlesSection;
