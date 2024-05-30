import dayjs from "dayjs";
import { Link, useParams } from "react-router-dom";
import { IArticleList } from "../interfaces/global";
import { SaveIcon, SavedIcon, UserAvatarIcon } from "./Icons";
import { useMemo, useState } from "react";
import { useSaveArticleMutation } from "../services/queries/article";
interface IProps {
  page: "feed" | "saved-feed" | "profile";
  width?: string;
  dialogRef?: React.RefObject<HTMLDialogElement | null>;
  article: IArticleList;
  userSavedArticles?: Array<{
    createdAt: Date;
    article: string;
  }>;
  providedPublisher?: {
    _id: string;
    username: string;
    avatar: string;
  };
  isLoggedIn?: boolean;
  setErrorMessage?: React.Dispatch<React.SetStateAction<string>>;
}
const ArticleList = ({
  page,
  article,
  providedPublisher,
  userSavedArticles,
  isLoggedIn,
  dialogRef,
  width,
}: IProps) => {
  const { _id, title, readTime, createdAt, publisher, subTitle, cover } =
    article;
  const params = useParams();
  const username = params.username?.replace(/-/g, " ");
  const [isArticleSaved, setIsArticleSaved] = useState<boolean>();
  const saveArticleMutation = useSaveArticleMutation();
  useMemo(() => {
    setIsArticleSaved(
      page === "saved-feed"
        ? true
        : userSavedArticles?.some((saved) => saved.article === _id)
        ? true
        : false
    );
  }, []);
  const publisherDetails = providedPublisher ?? publisher;
  const handleShowCreateAccountPopUp = () => {
    console.log("show popup");
    console.log(dialogRef);

    document.body.style.overflowY = "hidden";
    dialogRef?.current?.showModal();
  };
  const handleSaveArticle = () => {
    console.log("save article");
    saveArticleMutation.mutate({
      articleId: _id,
      action: isArticleSaved ? "un-save" : "save",
      publisherId: publisher?._id || providedPublisher?._id || "",
      username: username || "profile",
    });
    console.log(saveArticleMutation.error, saveArticleMutation.data);

    setIsArticleSaved((prev) => !prev);
  };
  return (
    <li
      className={`${
        page === "feed"
          ? "xl:w-[90%] lg:w-[70%] md:w-[80%] sm:w-[98%]"
          : "xl:w-[85%] md:w-[85%] sm:w-[90%]"
      } ${width}`}
    >
      <article className="flex justify-between items-center gap-2 md:mb-10 pb-10">
        <div className="flex flex-col justify-center flex-grow">
          <div className="flex gap-3 items-center ">
            <span className="w-fit h-fit">
              <UserAvatarIcon
                width={6}
                height={6}
                avatar={publisherDetails?.avatar}
                alt={`${publisherDetails?.username}'s Avatar`}
              />
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
            className="sm:w-[9rem] sm:h-[6rem] lg:w-[12.5rem] lg:h-[8.3rem]"
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
export default ArticleList;
