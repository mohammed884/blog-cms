import { lazy, useEffect, useRef, useState, Suspense } from "react";
import Editor from "./components/Editor";
import useLocalStorage from "../../../hooks/useLocalStorage";
import useDebounce from "../../../hooks/useDebounce";
const DetailsDialog = lazy(() => import("./components/DetailsDialog"));

const ARTICLE_CONTENT_KEY = "ARTICLE_CONTENT_KEY";
const ARTICLE_TITLE_KEY = "ARTICLE_TITLE";
const Publish = () => {
  const { setItem, getItem } = useLocalStorage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [savingStatus, setSavingStatus] = useState(true);
  const [title, setTitle] = useState(
    (getItem(ARTICLE_TITLE_KEY) as string) || ""
  );
  const [content, setContent] = useState(
    (getItem(ARTICLE_CONTENT_KEY) as string) || ""
  );
  const articleDetailsDialogRef = useRef<HTMLDialogElement>(null);
  const debouncedTitle = useDebounce(title);
  const debouncedContent = useDebounce(content);
  useEffect(() => {
    setSavingStatus(true);
  }, [debouncedContent, debouncedTitle]);
  const handleTyping = (
    value: string,
    localStorageKey: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setSavingStatus(false);
    setter(value);
    setItem(localStorageKey, value);
  };
  return (
    <section className="pt-[6.5rem]">
      <Suspense fallback={"...loading "}>
        {isDialogOpen && (
          <DetailsDialog
            content={content}
            title={title}
            setTitle={setTitle}
            setSavingStatus={setSavingStatus}
            articleContentKey={ARTICLE_CONTENT_KEY}
            articleTitleKey={ARTICLE_TITLE_KEY}
            ref={articleDetailsDialogRef}
          />
        )}
      </Suspense>
      <div className="w-[85%] mx-auto">
        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <input
              className="w-full text-xl font-bold border-r-2 border-gray-300 px-2 py-4 mb-6 outline-none"
              type="text"
              placeholder="العنوان"
              autoFocus={true}
              value={title}
              onChange={(e) =>
                handleTyping(e.target.value, ARTICLE_TITLE_KEY, setTitle)
              }
            />
            <Editor
              savingStatus={savingStatus}
              content={content}
              setContent={setContent}
              localStorageKey={ARTICLE_CONTENT_KEY}
              handleTyping={handleTyping}
            />
          </div>
        </form>
        <div className="flex gap-3">
          <button
            type="button"
            aria-label="next button"
            onClick={() => {
              setIsDialogOpen(true);
              articleDetailsDialogRef.current?.showModal();
            }}
            className={`bg-[#606c3866] text-sm rounded-md py-2 px-4 mt-3`}
          >
            التالي
          </button>
        </div>
      </div>
    </section>
  );
};
export default Publish;
