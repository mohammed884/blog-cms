import React from "react";
import { ITopic } from "../../../interfaces/global";
interface IProps {
  topicTitle: string;
  index?: number;
  isSelected: boolean;
  selectedTopics: Array<string>;
  setSelectedTopics: React.Dispatch<React.SetStateAction<Array<string>>>;
}
const TopicList = ({
  topicTitle,
  index,
  isSelected,
  selectedTopics,
  setSelectedTopics,
}: IProps) => {
  const updateSelectedTopics = (
    e: React.ChangeEvent<HTMLInputElement>,
    topicTitle: string,
  ) => {
    const isTopicAdded =
      index !== undefined ? selectedTopics[index] || false : false;
    const topicContainer = e.target.closest("li");
    if (!topicContainer) return;
    if (isTopicAdded) {
      setSelectedTopics((prev) => prev.filter((t) => t !== topicTitle));
      topicContainer.classList.remove("border");
    } else {
      setSelectedTopics((prev) => [...prev, topicTitle]);
      topicContainer.classList.add("border");
    }
    topicContainer.classList.toggle("bg-light_gray");
  };
  const iconSrc = isSelected
    ? "../../../../public/svgs/close-mark.svg"
    : "../../../../public/svgs/check-mark.svg";
  const iconAlt = isSelected ? "close mark svg" : "ok mark svg";
  return (
    <li
      className={`p-2 px-3 ${!isSelected && "bg-light_gray"} rounded-lg ${
        isSelected && "border"
      } border-light_green transition-colors ease-linear`}
      key={topicTitle}
    >
      <label
        onClick={(e: any) => updateSelectedTopics(e, topicTitle)}
        className="cursor-pointer flex items-center justify-center gap-2"
        htmlFor={topicTitle}
      >
        {topicTitle}
        <span className="">
          <img className="w-4 h-4 " src={iconSrc} alt={iconAlt} />
        </span>
      </label>
      <input
        className="hidden pointer-events-none"
        type="checkbox"
        name="topics"
        id={topicTitle}
        value={topicTitle}
      />
    </li>
  );
};

export default TopicList;
