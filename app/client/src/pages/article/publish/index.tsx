import { useEffect, useState } from "react";
import Editor from "./components/Editor";
import useLocalStorage from "../../../hooks/useLocalStorage";
import { getUserQuery } from "../../../services/queries/user";
import useDebounce from "../../../hooks/useDebounce";
interface IStepControlButton {
  context: string;
  className?: string;
  event: () => void;
  ariaLabel: string;
}
const Publish = () => {
  const { setItem, getItem } = useLocalStorage();
  const [savingStatus, setSavingStatus] = useState(true);
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState(
    (getItem("un-published-article-title") as string) || ""
  );
  const [description, setDescription] = useState(
    (getItem("un-published-article-body") as string) || ""
  );
  const debouncedTitle = useDebounce(title);
  const debouncedDescription = useDebounce(description);
  const profile = getUserQuery("profile");
  useEffect(() => {
    setSavingStatus(true);
  }, [debouncedDescription, debouncedTitle]);
  const handleTypingTitle = (title: string) => {
    setSavingStatus(false);
    setTitle(title);
    setItem("un-published-article-title", title);
  };
  const handleTyping = (richText: string) => {
    setSavingStatus(false);
    setDescription(richText);
    setItem("un-published-article-body", description);
  };
  const handleSubmit = () => {};
  return (
    <section className="pt-[6.5rem]">
      <div className="w-[70%] mx-auto">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className={`${step !== 1 && "hidden"}`}>
            <input
              className="w-full text-xl font-bold border-r-2 border-gray-300 px-2 py-4 mb-6 outline-none"
              type="text"
              placeholder="العنوان"
              autoFocus={true}
              value={title}
              onChange={(e) => handleTypingTitle(e.target.value)}
            />
            <Editor
              savingStatus={savingStatus}
              description={description}
              handleTyping={handleTyping}
            />
          </div>
          <div
            className={`w-full bg-red-50 flex justify-between ${
              step !== 2 && "hidden"
            }`}
          >
            <div>
              <p>
                النشر الى:
                <b> {profile.data?.user.username}</b>
              </p>
              <p>
                <span>يمكنك اضافة خمس مواضيع بحد اقصى</span>
              </p>
            </div>
            <div>preview + sub title</div>
          </div>
          <div className="flex gap-3">
            {step === 1 ? (
              <StepControlButton
                context="التالي"
                ariaLabel="next button"
                event={() => setStep((prev) => prev + 1)}
              />
            ) : (
              <StepControlButton
                context="انشر"
                ariaLabel="publish article button"
                event={handleSubmit}
              />
            )}
            <StepControlButton
              context="رجوع"
              ariaLabel="previous button"
              event={() => setStep((prev) => prev - 1)}
              className={`${step === 1 && "hidden"}`}
            />
          </div>
        </form>
      </div>
    </section>
  );
};
const StepControlButton = ({
  context,
  event,
  className,
  ariaLabel,
}: IStepControlButton) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={event}
      className={`bg-light_green rounded-md py-2 px-4 mt-3 ${className}`}
    >
      {context}
    </button>
  );
};

export default Publish;
