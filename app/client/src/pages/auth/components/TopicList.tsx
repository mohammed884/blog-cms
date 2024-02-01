import React from "react";
import { ITopic } from "../../../interfaces/global";
interface IProps {
  topic: ITopic;
  index?: number;
  isSelected: boolean;
  selectedTopics: Array<ITopic>;
  setSelectedTopics: React.Dispatch<React.SetStateAction<Array<ITopic>>>;
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
    topic: ITopic
  ) => {
    e.stopPropagation();
    const isTopicAdded = index !== undefined ? (selectedTopics[index] || false) : false;
    const topicContainer = e.target.closest("li");
    if (!topicContainer) return;
    if (isTopicAdded) {
      setSelectedTopics((prev) => prev.filter((t) => t.title !== topic.title));
      topicContainer.classList.remove("border");
    } else {
      setSelectedTopics((prev) => [...prev, topic]);
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
        onClick={(e: any) => updateSelectedTopics(e, topic)}
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
