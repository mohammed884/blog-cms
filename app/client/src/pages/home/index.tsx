import { useRef, useState } from "react";
import WelcomeSection from "./components/WelcomeSection";
import { IArticle } from "../../interfaces/global";
import TopArticlesSection from "./components/TopArticlesSection";
import FeedSection from "./components/FeedSection";
import { useGetFeedQuery } from "../../store/services/article";
import LoginPopup from "../../components/LoginPopup";
const index = () => {
  const [page, setPage] = useState(1);
  const LoginPopupRef = useRef<HTMLDialogElement>(null);
  const {
    data: feedData,
    isLoading,
    isError,
    error,
  } = useGetFeedQuery({ page });
  const articles: Array<IArticle> = [
    {
      _id: "1",
      cover: "books.png",
      subTitle: "اشبع فضولك. تسلم الدفة و ابحر في عالم من الخبرات",
      title: "اشبع فضولك. تسلم الدفة و ابحر في عالم من الخبرات",
      publisher: {
        _id: "1",
        username: "منشئ",
        avatar: "books.png",
      },
      readTime: 5,
      createdAt: new Date(),
    },
    {
      _id: "2",
      title: "اشبع فضولك. تسلم الدفة و ابحر في عالم من الخبرات",
      subTitle: "اشبع فضولك. تسلم الدفة و ابحر في عالم من الخبرات",
      cover: "books.png",
      publisher: {
        _id: "1",
        username: "منشئ",
        avatar: "books.png",
      },
      readTime: 5,
      createdAt: new Date(),
    },
    {
      _id: "3",
      title: "اشبع فضولك. تسلم الدفة و ابحر في عالم من الخبرات",
      subTitle: "اشبع فضولك. تسلم الدفة و ابحر في عالم من الخبرات",
      cover: "books.png",
      publisher: {
        _id: "1",
        username: "منشئ",
        avatar: "books.png",
      },
      readTime: 5,
      createdAt: new Date(),
    },
    {
      _id: "4",
      title: "اشبع فضولك. تسلم الدفة و ابحر في عالم من الخبرات",
      subTitle: "اشبع فضولك. تسلم الدفة و ابحر في عالم من الخبرات",
      cover: "books.png",
      publisher: {
        _id: "1",
        username: "منشئ",
        avatar: "books.png",
      },
      readTime: 5,
      createdAt: new Date(),
    },
    {
      _id: "5",
      title: "اشبع فضولك. تسلم الدفة و ابحر في عالم من الخبرات",
      subTitle: "اشبع فضولك. تسلم الدفة و ابحر في عالم من الخبرات",
      cover: "books.png",
      publisher: {
        _id: "1",
        username: "منشئ",
        avatar: "books.png",
      },
      readTime: 5,
      createdAt: new Date(),
    },
    {
      _id: "6",
      title: "اشبع فضولك. تسلم الدفة و ابحر في عالم من الخبرات",
      subTitle: "6اشبع فضولك. تسلم الدفة و ابحر في عالم من الخبرات",
      cover: "books.png",
      publisher: {
        _id: "1",
        username: "منشئ",
        avatar: "books.png",
      },
      readTime: 5,
      createdAt: new Date(),
    },
  ];
  const topics = [
    {
      _id: "1",
      title: "علوم",
    },
    {
      _id: "2",
      title: "برمجة",
    },
    {
      _id: "3",
      title: "تكنولوجيا",
    },
    {
      _id: "4",

      title: "تعليم",
    },
    {
      _id: "5",
      title: "تصميم",
    },
    {
      _id: "6",
      title: "تصميم داخلي",
    },
  ];
  if (isLoading) return <div>Loading..</div>;
  // if (isError) return <div>Error</div>;
  return (
    <main className="w-[100vw] h-fit text-center">
      <LoginPopup ref={LoginPopupRef} />

      <WelcomeSection dialogRef={LoginPopupRef} />
      <section className="xl:w-[85%] lg:w-[88%] sm:w-[95%] mx-auto">
        <TopArticlesSection articles={articles} />
        <FeedSection
          feed={feedData?.articles || []}
          isFeedLoading={isLoading}
          topics={topics}
          dialogRef={LoginPopupRef}
          setPage={setPage}
          page={page}
          hasMore={feedData?.hasMore || false}
        />
      </section>
    </main>
  );
};
export default index;
