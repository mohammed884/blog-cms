import React from "react";
import { ITopic } from "../../../interfaces/global";
interface IProps {
  topic: ITopic;
  index: number;
  isSelected: boolean;
  selectedTopics: Array<number>;
  setSelectedTopics: React.Dispatch<React.SetStateAction<Array<number>>>;
}
const TopicList = ({
  topic,
  index,
  isSelected,
  selectedTopics,
  setSelectedTopics,
}: IProps) => {
  const updateSelectedTopics = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    e.stopPropagation();
    const isTopicAdded = selectedTopics.includes(index);
    const topicContainer = e.target.closest("li");
    if (!topicContainer) return;
    if (isTopicAdded) {
      setSelectedTopics((prev) => prev.filter((topic) => topic !== index));
      topicContainer.classList.remove("border");
    } else {
      setSelectedTopics((prev) => [...prev, index]);
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
      key={topic._id}
    >
      <label
        onClick={(e: any) => updateSelectedTopics(e, index)}
        className="cursor-pointer flex items-center justify-center gap-2"
        htmlFor={topic.title}
      >
        {topic.title}
        <span className="">
          <img className="w-4 h-4 " src={iconSrc} alt={iconAlt} />
        </span>
      </label>
      <input
        type="checkbox"
        name="topics"
        id={topic.title}
        value={topic.title}
      />
    </li>
  );
};

export default TopicList;
