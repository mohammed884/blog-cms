import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { IArticle } from "../interfaces/global";
import { useSaveArticleMutation } from "../store/services/article";
import { BlankUserIcon, SaveIcon, SavedIcon, UserAvatarIcon } from "./Icons";
import { useMemo, useState } from "react";
interface IProps {
  page: "feed" | "profile";
  dialogRef?: React.RefObject<HTMLDialogElement | null>;
  article: IArticle;
  userSavedArticles?: Array<{
    createdAt: Date;
    article: string;
  }>;
  articlePublisher?: {
    username: string;
    avatar: string;
  };
  isLoggedIn?: boolean;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}
const ArticlesList = ({
  page,
  article,
  articlePublisher,
  userSavedArticles,
  isLoggedIn,
  dialogRef,
  setErrorMessage,
}: IProps) => {
  // const userData = useAppSelector(userProfileSelector);s
  // const [saveArticle,setSaveArticle] = useState("")
  const { _id, title, readTime, createdAt, publisher, subTitle, cover } =
    article;
  const [isArticleSaved, setIsArticleSaved] = useState<boolean>(
    useMemo(() => {
      return userSavedArticles?.some((a) => a.article === _id) ? true : false;
    }, [])
  );
  const [saveArticle, { isLoading: isArticleBeingSaved, isError }] =
    useSaveArticleMutation();
  const publisherDetails = articlePublisher ?? publisher;
  const handleShowCreateAccountPopUp = () => {
    document.body.style.overflowY = "hidden";
    dialogRef?.current?.showModal();
  };
  const handleSaveArticle = async () => {
    await saveArticle({ _id })
      .unwrap()
      .then((fulfilled) => {
        setIsArticleSaved((prev) => !prev);
      })
      .catch((reason) => {
        console.log(reason);
        setErrorMessage(reason.data.message);
      });
  };
  return (
    <li
      className={`${
        page === "feed"
          ? "xl:w-[90%] lg:w-[70%] md:w-[80%] sm:w-[98%]"
          : "xl:w-[85%] md:w-[85%] sm:w-[90%]"
      }`}
    >
      <article className="flex justify-between items-center gap-2 md:mb-10 pb-10">
        <div className="flex flex-col justify-center flex-grow">
          <div className="flex gap-3 items-center ">
            <span className="w-fit h-fit">
              {publisherDetails?.avatar ? (
                <UserAvatarIcon
                  width={6}
                  height={6}
                  avatar={publisherDetails.avatar}
                  alt={`${publisherDetails?.username}'s Avatar`}
                />
              ) : (
                <BlankUserIcon
                  width={6}
                  height={6}
                  alt={`${publisherDetails?.username}'s Avatar`}
                />
              )}
            </span>
            <span className="md:text-[.85rem] sm:text-[.75rem] font-bold">
              <Link
                to={`/user/${publisherDetails?.username.replace(/ /g, "-")}`}
              >
                {publisherDetails?.username}
              </Link>
            </span>
          </div>
          <div className="h-fit text-right mt-4">
            <Link to={`/article/${article._id}`}>
              <p className="lg:text-[1.5rem] md:text-[1.3rem] sm:text-[1.05rem] font-black mb-2">
                {title}
              </p>
              <summary className="md:inline sm:hidden text-[1rem] font-medium opacity-75">
                {subTitle}
              </summary>
            </Link>
            <div className="flex justify-between mt-4">
              <p className="md:text-[.9rem] sm:text-[.8rem] mt-1">
                {dayjs(createdAt).format("DD MMM")} . دقائق {readTime}
              </p>
              <button
                className="md:w-8 md:h-6 sm:w-6 sm:h-5 pb-4"
                onClick={
                  isLoggedIn ? handleSaveArticle : handleShowCreateAccountPopUp
                }
              >
                {isArticleSaved ? (
                  <SavedIcon width={6} height={6} />
                ) : (
                  <SaveIcon width={6} height={6} />
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <img
            className="sm:w-[10rem] sm:h-[6.2rem] lg:w-[12.5rem] lg:h-[8.3rem]"
            width={"200"}
            height={"134"}
            loading="lazy"
            src={`${import.meta.env.VITE_API_URL}/uploads/${"writing.jpeg"}`}
            alt={`${title} cover`}
          />
        </div>
      </article>
    </li>
  );
};
export default ArticlesList;
