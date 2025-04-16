import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getArticleQuery,
  useSaveArticleMutation,
} from "../../services/queries/article";
import { Loader, MessageCircle, ThumbsUp } from "lucide-react";
import { SavedIcon, SaveIcon, UserAvatarIcon } from "../../components/Icons";
import { getUserQuery } from "../../services/queries/user";
import FollowButton from "../../components/FollowButton";
import dayjs from "dayjs";
import parseTextToHtml from "html-react-parser";
const Article = () => {
  const params = useParams() as { title: string; id: string };
  const articleData = getArticleQuery(params.id);
  const viewerData = getUserQuery("profile");
  const saveArticleMutation = useSaveArticleMutation();
  const viewer = viewerData.data;
  const [isArticleBeingSaved, setIsArticleBeingSaved] = useState(false);
  const articleSaveStatus: boolean = useMemo(() => {
    return (
      Number(viewer?.user.saved.findIndex((s) => s.article === params.id)) > -1
    );
  }, [isArticleBeingSaved]);
  if (viewerData.isLoading || articleData.isLoading) {
    return <Loader />;
  }
  if (viewerData.isError || articleData.isError) {
    return console.log("error");
  }
  const handleSaveArticle = async () => {
    try {
      saveArticleMutation.mutateAsync({
        articleId: params.id,
        action: articleSaveStatus ? "un-save" : "save",
        publisherId: publisher?._id || article?.publisher?._id || "",
        username: "profile",
      });
      setIsArticleBeingSaved((prev) => !prev);
    } catch (err) {
      console.log(err);
    }
  };
  const handleLike = async () => {
    //
  };
  const handleComment = async () => {
    //
  };
  const article = articleData.data?.article;
  const publisher = article?.publisher;
  return (
    <section className="md:w-[80%] sm:w-[90%] pt-32 mx-auto">
      <h1 className="text-4xl font-bold">{article?.title}</h1>
      <div className="flex items-center gap-4 mt-6">
        <UserAvatarIcon
          width={8}
          height={8}
          avatar={publisher?.avatar}
          alt={`${publisher?.username}'s avatar`}
        />
        <div className="text-sm">
          <p>{publisher?.username}</p>
          <div className="flex items-center gap-2 mt-1">
            <time>{dayjs(article?.createdAt).format("YYYY/M/D")} |</time>
            <span>{article?.readTime} دقائق</span>
          </div>
        </div>
        {!viewer?.isSameUser && (
          <FollowButton
            userId={viewer?.user._id || ""}
            ownerId={publisher?._id || ""}
            isFollowingYou={viewer?.isFollowingYou || false}
            youFollowing={viewer?.youFollowing || false}
          />
        )}
      </div>
      <div className="flex items-center justify-between gap-4 mt-8 py-4 px-2 border-light_gray border-y-2">
        <div className="flex items-center gap-4">
          <p className="flex items-center gap-1  font-bold">
            {article?.likesCount || 0}
            <span>
              <ThumbsUp />
            </span>
          </p>
          <p className="flex items-center gap-1 font-bold">
            {article?.commentsCount || 0}
            <span>
              <MessageCircle />
            </span>
          </p>
        </div>
        <button onClick={handleSaveArticle}>
          {articleSaveStatus ? (
            <SavedIcon width={5} height={5} />
          ) : (
            <SaveIcon width={5} height={5} />
          )}
        </button>
      </div>
      <div className="mt-6">{parseTextToHtml(article?.content || "")}</div>
    </section>
  );
};

export default Article;
