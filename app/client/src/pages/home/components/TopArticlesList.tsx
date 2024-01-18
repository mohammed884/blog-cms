import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { IArticle } from "../../../interfaces/global";
interface ITopArticlesListProps {
  index: number;
  article: IArticle;
}
const topArticlesList = ({ index, article }: ITopArticlesListProps) => {
  const { title, publisher, readTime, createdAt } = article;
  return (
    <li>
      <article className="flex items-start mb-5">
        <div className="flex gap-3 p-2">
          <div className="mb-8">
            <span className="w-fit h-fit text-3xl font-black text-dark_green opacity-[.2]">
              {"0" + (index + 1)}
            </span>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex gap-3 items-center">
              <span className="w-fit h-fit">
                <img
                  className="w-6 h-6 rounded-[50%]"
                  src={`../../../../public/images/${publisher.avatar}`}
                  alt={`${publisher.avatar} avatar`}
                />
              </span>
              <span className="text-[.85rem] font-bold opacity-95">
                <Link to={`/user/${publisher.username}`}>
                  {publisher.username}
                </Link>
              </span>
            </div>
            <div className="mt-2">
              <Link to={`/article/${article._id}`}>
                <p className="text-[1.1rem] font-bold">{title}</p>
              </Link>
              <p className="text-[.9rem] mt-2 opacity-85">
                {dayjs(createdAt).format("DD MMM")} . دقائق {readTime}
              </p>
            </div>
          </div>
        </div>
      </article>
    </li>
  );
};

export default topArticlesList;
