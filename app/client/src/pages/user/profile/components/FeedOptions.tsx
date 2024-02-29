import React from "react";
interface IProps {
  articlesTypeToShow: string;
  setArticlesTypeToShow: React.Dispatch<
    React.SetStateAction<"published" | "saved">
  >;
  isSameUser: boolean;
}
const FeedOptions = ({
  articlesTypeToShow,
  setArticlesTypeToShow,
  isSameUser,
}: IProps) => {
  return (
    <div className="w-[100%] grid grid-cols-2 justify-around border-b mt-14 p-2">
      <button
        onClick={() => setArticlesTypeToShow("published")}
        className={`w-fit mx-auto text-md font-bold transition-colors ease-linear ${
          articlesTypeToShow === "published" && "border-b-dark_green"
        } border-b-2 border-off_white`}
      >
        المقالات
      </button>
      {isSameUser ? (
        <button
          onClick={() => setArticlesTypeToShow("saved")}
          className={`w-fit mx-auto text-md font-bold transition-colors ease-linear ${
            articlesTypeToShow === "saved" && "border-b-dark_green"
          } border-b-2 border-off_white `}
        >
          المحفوظات
        </button>
      ) : (
        <button
          onClick={() => setArticlesTypeToShow("saved")}
          className={`w-fit mx-auto text-md font-bold transition-colors ease-linear ${
            articlesTypeToShow === "saved" && "border-b-dark_green"
          } border-b-2 border-off_white `}
        >
          حول
        </button>
      )}
    </div>
  );
};

export default FeedOptions;
