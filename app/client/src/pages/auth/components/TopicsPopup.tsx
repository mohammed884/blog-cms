import { forwardRef, useEffect, useState } from "react";
import { useGetTopicsQuery } from "../../../store/services/topics";
import TopicList from "./TopicList";
import { ITopic } from "../../../interfaces/global";
const TopicsSelectionStep = forwardRef<HTMLDivElement, {}>(({}, ref: any) => {
  const [openTopicsPopup, setOpenTopicsPopup] = useState(true);
  const [selectedTopics, setSelectedTopics] = useState<Array<number>>([]);

  const { data, isLoading, isError, error } = useGetTopicsQuery({});
  useEffect(() => {
    return () => {
      ref?.current?.removeEventListener("click", handleClose);
    };
  }, []);
  const handleClose = (e: any) => {
    if (e.target === ref?.current) setOpenTopicsPopup(false);
  };
  ref?.current?.addEventListener("click", handleClose);
  if (isError) return <div>Error</div>;
  if (isLoading) return;
  return (
    <fieldset>
      <div className="flex items-center justify-center text-center">
        {selectedTopics.length === 0 ? (
          <div>
            <p className="text-md">لا توجد اهتمامات مختارة</p>
            <button
              className="text-dark_green underline mt-2"
              onClick={() => setOpenTopicsPopup(true)}
            >
              اختر من هنا
            </button>
          </div>
        ) : (
          <div>
            <ul className="flex justify-center items-center flex-wrap gap-2">
              {selectedTopics.map((index) => (
                <TopicList
                  isSelected={true}
                  selectedTopics={selectedTopics}
                  setSelectedTopics={setSelectedTopics}
                  key={index}
                  topic={data?.topics[index] as ITopic}
                  index={index}
                />
              ))}
            </ul>
            {/* <button className="mt-2" onClick={() => setOpenTopicsPopup(true)}>
                اختر المزيد
              </button> */}
          </div>
        )}
      </div>
      <div
        ref={ref}
        className={`popup w-[100vw] h-[100vh] flex items-center justify-center flex-col fixed top-0 left-0 bg-[#0000007f] z-[10000] ${
          !openTopicsPopup && "hidden"
        }`}
      >
        <div className="w-[50vw] h-[70vh] flex justify-center items-center flex-col gap-10 bg-off_white rounded-md">
          <label
            className="flex flex-col text-[1.7rem] font-black text-center"
            htmlFor="topics"
          >
            بماذا انت مهتم؟
            <span className="text-[.9rem] font-medium opacity-80">
              اختر قدر ما تحب
            </span>
          </label>
          <ul
            className="w-[60%] flex justify-center items-center flex-wrap gap-2"
            id="topics"
          >
            {data?.topics.map((topic, index) => (
              <TopicList
                isSelected={selectedTopics.includes(index)}
                key={index}
                topic={topic}
                index={index}
                selectedTopics={selectedTopics}
                setSelectedTopics={setSelectedTopics}
              />
            ))}
          </ul>
          <button
            aria-label="next button"
            type="button"
            onClick={() => setOpenTopicsPopup(false)}
            className={`w-[45%] text-off_white bg-black font-bold border-2 p-2 px-5 text-sm rounded-md "w-[100%]" border-[#36454F]`}
          >
            التالي
          </button>
        </div>
      </div>
    </fieldset>
  );
});
export default TopicsSelectionStep;
