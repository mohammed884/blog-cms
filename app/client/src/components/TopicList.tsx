interface IProps {
  topic: string;
}
import { Link } from "react-router-dom";
const TopicsList = ({ topic }: IProps) => {
  return (
    <li className="w-fit text-center h-fit bg-light_gray p-3 rounded-[30%]">
      <Link to={`/topic/${topic}`} className="text-sm font-medium">
        {topic}
      </Link>
    </li>
  );
};

export default TopicsList;
