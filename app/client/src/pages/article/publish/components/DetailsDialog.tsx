import { useState, forwardRef, useEffect, useRef } from "react";
import { getUserQuery } from "../../../../services/queries/user";
import { Camera, XIcon } from "lucide-react";
import useLocalStorage from "../../../../hooks/useLocalStorage";
import useDebounce from "../../../../hooks/useDebounce";
import { searchTopicsQuery } from "../../../../services/queries/topic";
import { usePublishArticleMutation } from "../../../../services/queries/article";
import { useNavigate } from "react-router-dom";
const ARTICLE_SUB_TITLE_KEY = "ARTICLE_SUB_TITLE";
interface TopicList {}
interface IDetailsDialogProps {
  title: string;
  content: string;
  articleTitleKey: string;
  articleContentKey: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setSavingStatus: React.Dispatch<React.SetStateAction<boolean>>;
}
const DetailsDialog = forwardRef<HTMLDialogElement, IDetailsDialogProps>(
  (
    {
      title,
      content,
      articleTitleKey,
      articleContentKey,
      setTitle,
      setSavingStatus,
    },
    dialogRef: any
  ) => {
    const { setItem, getItem } = useLocalStorage();
    const navigate = useNavigate();
    const [subTitle, setSubTitle] = useState(
      (getItem(ARTICLE_SUB_TITLE_KEY) as string) || ""
    );
    const [cover, setCover] = useState<File | undefined>();
    const [coverUrl, setCoverUrl] = useState<string>();
    const [selectedTopics, setSelectedTopics] = useState<Array<string>>([]);
    const [topicsSearchTitle, setTopicsSearchTitle] = useState("");
    const debouncedTopicSearch = useDebounce(topicsSearchTitle);
    const topicsSearchInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const topicsSearchResult = searchTopicsQuery(debouncedTopicSearch);
    const profile = getUserQuery("profile");
    const publishMutation = usePublishArticleMutation();
    useEffect(() => {
      dialogRef.current?.showModal();
    }, []);
    useEffect(() => {
      dialogRef.current?.addEventListener("click", closeBackdrop);
      return () => {
        document.body.style.overflowY = "visible";
        dialogRef.current?.removeEventListener("click", closeBackdrop);
      };
    }, []);
    const topicsSearchInputRect =
      topicsSearchInputRef.current?.getBoundingClientRect();
    const closeBackdrop = (e: any) => {
      const target = e.target;
      if (target.tagName !== "DIALOG") return;
      const dialog = e.target.closest("dialog");
      dialog.close();
      document.body.style.overflowY = "visible";
    };
    const handleCloseDialog = () => {
      document.body.style.overflowY = "visible";
      dialogRef.current?.close();
    };
    const handleTyping = (
      value: string,
      localStorageKey: string,
      setter: React.Dispatch<React.SetStateAction<string>>
    ) => {
      setSavingStatus(false);
      setter(value);
      setItem(localStorageKey, value);
    };
    const selectTopic = (title: string, key?: string) => {
      if (selectedTopics.length === 5) return;
      if (!title || title === " " || (key && key !== "Enter")) return;
      const doesTopicExist = topicsSearchResult.data?.topics.findIndex(
        (t) => t.title === title
      );
      if (doesTopicExist === undefined || doesTopicExist === -1) return;
      const isTopicAdded = selectedTopics.findIndex((t) => t === title);
      if (isTopicAdded > -1) return;
      setSelectedTopics((prev) => [...prev, title]);
      setTopicsSearchTitle("");
      const input = topicsSearchInputRef.current;
      if (input?.value !== null && input?.value !== undefined) {
        input.value = "";
      }
    };
    const handlePublishing = () => {
      publishMutation.mutate({
        title,
        subTitle,
        topics: selectedTopics,
        cover,
        content,
      });
      if (publishMutation.isSuccess) {
        setItem(articleTitleKey, "");
        setItem(ARTICLE_SUB_TITLE_KEY, "");
        setItem(articleContentKey, "");
        navigate(
          `/article/${profile.data?.user.username}/${publishMutation.data.title}`
        );
      }
    };
    return (
      <dialog
        ref={dialogRef}
        className={`w-[80vw] h-[85vh] z-[100] m-auto rounded-md`}
      >
        <div className="w-[90%] mx-auto mt-6">
          <button onClick={handleCloseDialog}>
            <XIcon size={20} />
          </button>
        </div>
        <div className="w-[85%] h-[90%] grid grid-cols-2 gap-[9rem] justify-center items-center mx-auto">
          <div>
            <p className="text-[1.2rem] opacity-75">
              النشر الى:
              <b> {profile.data?.user.username}</b>
            </p>
            <div className="flex flex-col gap-3 mt-2">
              <p className="text-sm opacity-75">
                <span>
                  اضف المواضيع التي تمد بصلة لقصتك (الى حد خمس مواضيع)
                </span>
              </p>
              <div className="flex items-center bg-[#fafafa] px-3 py-3 border rounded-sm placeholder:text-sm placeholder:font-semibold">
                <form
                  className="flex flex-col gap-3 outline-[0px]"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    ref={topicsSearchInputRef}
                    className="bg-inherit w-[6rem] placeholder:text-[.8rem] placeholder:font-semibold outline-none"
                    type="text"
                    placeholder="اضف موضوعا ..."
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === " ") return;
                      setTopicsSearchTitle(e.target.value);
                    }}
                    onKeyDown={(e: any) => selectTopic(e.target.value, e.key)}
                    autoFocus={true}
                  />
                </form>
                <ul className="flex flex-wrap gap-2">
                  {selectedTopics.map((topic) => (
                    <TopicList
                      title={topic}
                      setSelectedTopics={setSelectedTopics}
                    />
                  ))}
                </ul>
                {!topicsSearchTitle ||
                  (!!debouncedTopicSearch && (
                    <ul
                      style={{
                        top: `${Math.floor(
                          Number(topicsSearchInputRect?.top) - 30
                        )}px`,
                      }}
                      className={`w-[11rem] h-fit flex flex-col gap-2 bg-off_white border border-gray-300 rounded-sm p-2 absolute z-[1000]`}
                    >
                      {topicsSearchResult.isLoading ? (
                        Array(5)
                          .fill(0)
                          .map((_, index) => (
                            <li
                              key={index + "topic-skiletion"}
                              className="w-full bg-slate-200 text-transparent h-fit animate-pulse"
                            >
                              0
                            </li>
                          ))
                      ) : Number(topicsSearchResult.data?.topics.length) > 0 ? (
                        topicsSearchResult.data?.topics.map((topic) => (
                          <li
                            key={topic._id}
                            className="w-full flex items-center bg-white text-sm font-bold p-2 rounded-sm hover:bg-vivid_green hover:text-white"
                          >
                            <button
                              className="w-full text-right pl-6"
                              onClick={() => selectTopic(topic.title)}
                            >
                              <span>{topic.title}</span>
                            </button>
                          </li>
                        ))
                      ) : (
                        <span className="text-sm opacity-70">
                          لم يتم العثور على المواضيع
                        </span>
                      )}
                    </ul>
                  ))}
              </div>
              <button
                onClick={handlePublishing}
                className="text-[.75rem] font-semibold ml-auto text-white rounded-xl px-4 py-3 bg-vivid_green"
              >
                انشر الان
              </button>
            </div>
          </div>
          <div>
            <p className="mb-3 ">
              <b>مراجعة القصة </b>
            </p>
            <div className="h-[25vh] border rounded-sm">
              {coverUrl ? (
                <img
                  className="w-full h-full rounded-sm"
                  src={coverUrl}
                  alt="Article Cover"
                />
              ) : (
                <p className="w-fit m-auto">image preview</p>
              )}
            </div>
            <form
              className="flex flex-col gap-5 mt-4"
              encType="multipart/form-data"
            >
              <input
                type="text"
                className="w-full border-b pb-1 placeholder:font-bold outline-none"
                name="title"
                placeholder="اكتب العنوان"
                value={title}
                onChange={(e) =>
                  handleTyping(e.target.value, articleTitleKey, setTitle)
                }
              />
              <input
                type="text"
                className="w-full border-b pb-1 placeholder:text-sm outline-none"
                name="title"
                placeholder="اكتب عنوانا فرعيا ..."
                value={subTitle}
                onChange={(e) =>
                  handleTyping(
                    e.target.value,
                    ARTICLE_SUB_TITLE_KEY,
                    setSubTitle
                  )
                }
              />
              <label
                onClick={() => coverInputRef.current?.click()}
                className="w-fit flex gap-2 rounded-md p-2 border border-vivid_green cursor-pointer"
                htmlFor="cover"
              >
                <Camera size={20} />
              </label>
              <input
                className="hidden"
                id="cover"
                ref={coverInputRef}
                type="file"
                onChange={(e) => {
                  setCover(e.target.files ? e.target.files[0] : undefined);
                  setCoverUrl(
                    e.target.files ? URL.createObjectURL(e.target.files[0]) : ""
                  );
                }}
              />
            </form>
          </div>
        </div>
      </dialog>
    );
  }
);
const TopicList = ({
  title,
  setSelectedTopics,
}: {
  title: string;
  setSelectedTopics: React.Dispatch<React.SetStateAction<Array<string>>>;
}) => {
  return (
    <li className="w-fit flex items-center gap-2 bg-white text-sm p-2 border rounded-sm">
      <span>{title}</span>
      <button
        onClick={() =>
          setSelectedTopics((prev) => prev.filter((t) => t !== title))
        }
      >
        <XIcon size={10} />
      </button>
    </li>
  );
};
export default DetailsDialog;
