import { Link } from "react-router-dom";
import TopicList from "../../components/TopicList";
import { ITopic } from "../../interfaces/global";
interface ITopicsAside {
  topics: Array<ITopic>;
  showMoreTopicsLinks?: boolean;
  makeItSticky?: boolean;
}
const TopicsSection = ({
  topics,
  makeItSticky,
  showMoreTopicsLinks,
}: ITopicsAside) => {
  return (
    <aside
      className={`xl:w-[36%] sm:w-[90] h-fit ${
        makeItSticky && "xl:sticky"
      } md:mt-2 sm:mb-8 top-[5.25rem]`}
    >
      <h2 className="text-[1.2rem] font-extrabold">اكتشف ما تهواه نفسك</h2>
      <ul className="w-fit flex flex-wrap gap-3 mt-4">
        {topics.map((topic) => (
          <TopicList key={topic._id} topic={topic.title} />
        ))}
      </ul>
      <div className={`mt-8 ${!showMoreTopicsLinks && "hidden"}`}>
        <Link
          to="/topics"
          className="text-sm opacity-75 text-dark_green hover:underline"
        >
          شاهد المزيد من المواضيع
        </Link>
      </div>
    </aside>
  );
};

export default TopicsSection;
