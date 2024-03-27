import { useEffect } from "react";
import { useParams } from "react-router-dom";
interface IProps {
  feedSectionToShow: string;
  setFeedSectionToShow: React.Dispatch<
    React.SetStateAction<"published" | "saved" | "about">
  >;
  isSameUser: boolean;
}
interface IOptionButtonProps {
  feedToShow: "المقالات" | "المحفوظات" | "حول";
  feedType: "published" | "saved" | "about";
  feedSectionToShow: string;
  setFeedSectionToShow: React.Dispatch<
    React.SetStateAction<"published" | "saved" | "about">
  >;
}
const FeedOptions = ({
  feedSectionToShow,
  setFeedSectionToShow,
  isSameUser,
}: IProps) => {
  const { username } = useParams();
  useEffect(() => {
    setFeedSectionToShow("published");
  }, [username]);
  return (
    <div className="w-[100%] grid grid-cols-2 justify-around border-b mt-6 p-2">
      <OptionButton
        feedToShow="المقالات"
        feedType="published"
        feedSectionToShow={feedSectionToShow}
        setFeedSectionToShow={setFeedSectionToShow}
      />
      {isSameUser ? (
        <OptionButton
          feedToShow="المحفوظات"
          feedType="saved"
          feedSectionToShow={feedSectionToShow}
          setFeedSectionToShow={setFeedSectionToShow}
        />
      ) : (
        <OptionButton
          feedToShow="حول"
          feedType="about"
          feedSectionToShow={feedSectionToShow}
          setFeedSectionToShow={setFeedSectionToShow}
        />
      )}
    </div>
  );
};
const OptionButton = ({
  feedToShow,
  feedType,
  feedSectionToShow,
  setFeedSectionToShow,
}: IOptionButtonProps) => {
  return (
    <button
      onClick={() => setFeedSectionToShow(feedType)}
      className={`w-fit mx-auto text-sm  transition-colors ease-linear ${
        feedSectionToShow === feedType && "border-b-dark_green"
      } border-b-2 border-off_white `}
    >
      {feedToShow}
    </button>
  );
};
export default FeedOptions;
