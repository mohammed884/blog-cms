interface IPorps {
  fetchNextPage: any;
  hasMore: boolean;
  isDataLoading: boolean;
  messageAfterFetchingAllData?: string;
  btnStyle?: string;
  messageStyle?: string;
}
const LoadMoreBtn = ({
  fetchNextPage,
  hasMore,
  isDataLoading,
  messageAfterFetchingAllData,
  btnStyle,
  messageStyle,
}: IPorps) => {
  const btnStyling = `${
    !hasMore && "hidden"
  } text-[.8rem] p-2 px-4 rounded-md border border-dark_green ${
    isDataLoading && "animate-pulse"
  } ${btnStyle}`;
  const spanStyle = `text-sm opacity-60 ${messageStyle}`;

  return !hasMore ? (
    <div>
      <span className={spanStyle}>{messageAfterFetchingAllData}</span>
    </div>
  ) : (
    <button
      // disabled={isDataLoading}
      className={btnStyling}
      onClick={fetchNextPage}
    >
      حمل المزيد
    </button>
  );
};

export default LoadMoreBtn;
