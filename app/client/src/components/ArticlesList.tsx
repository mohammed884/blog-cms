import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { IArticle } from "../interfaces/global";
interface IProps {
  dialogRef?: React.RefObject<HTMLDialogElement | null>;
  article:IArticle
}
const articleList = ({ article, dialogRef }: IProps) => {
  const { title, publisher, readTime, createdAt, subTitle, cover } = article;
  const handleShowCreateAccountPopUp = () => {
    document.body.style.overflowY = "hidden";
    dialogRef?.current?.showModal();
  };
  return (
    <li>
      <article className="flex items-center gap-8 md:mb-10 pb-8">
        <div className="flex flex-col justify-center">
          <div className="flex gap-3 items-center">
            <span className="w-fit h-fit">
              <img
                loading="lazy"
                className="md:w-8 md:h-8 sm:w-7 sm:h-7 rounded-[50%]"
                src={`../../../../public/images/${publisher.avatar}`}
                alt={`${publisher.avatar} avatar`}
              />
            </span>
            <span className="md:text-[.85rem] sm:text-[.75rem] font-bold">
              <Link to={`/user/${publisher.username}`}>
                {publisher.username}
              </Link>
            </span>
          </div>
          <div className="mt-3">
            <Link to={`/article/${article._id}`}>
              <p className="md:text-[1.3rem] sm:text-[1.05rem] font-black">{title}</p>
              <summary className="md:inline sm:hidden text-[1rem] font-medium opacity-75">
                {subTitle}
              </summary>
            </Link>
            <div className="flex justify-between mt-4">
              <p className=",d:text-[.9rem] sm:text-[.8rem] mt-1">
                {dayjs(createdAt).format("DD MMM")} . دقائق {readTime}
              </p>
              <button
                className="md:w-8 md:h-6 sm:w-6 sm:h-5"
                onClick={handleShowCreateAccountPopUp}
              >
                <img src="../../public/svgs/save-icon.svg" alt="save icon" />
              </button>
            </div>
          </div>
        </div>
        <div className="w-[5.9rem] h-[5.9rem]">
          <img
            loading="lazy"
            src={`../../../../public/images/${cover}`}
            alt={`${title} cover`}
          />
        </div>
      </article>
    </li>
  );
};
export default articleList;
