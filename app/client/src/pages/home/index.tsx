import { useRef } from "react";
import WelcomeSection from "./components/WelcomeSection";
import { IArticleList } from "../../interfaces/global";
import TopArticlesSection from "./components/TopArticlesSection";
import FeedSection from "./components/FeedSection";
import { getFeedQuery } from "../../services/queries/article";
import LoginPopup from "../../components/LoginPopup";
import { Loader } from "lucide-react";
const index = () => {
  const LoginPopupRef = useRef<HTMLDialogElement>(null);
  const feed = getFeedQuery();
  const articles: Array<IArticleList> = [
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
  if (feed.isLoading) return <Loader />;
  return (
    <main className="w-[100vw] h-fit text-center">
      <LoginPopup ref={LoginPopupRef} />
      <WelcomeSection dialogRef={LoginPopupRef} />
      <section className="xl:w-[85%] lg:w-[88%] sm:w-[95%] mx-auto">
        <TopArticlesSection articles={articles} />
        <FeedSection
          feed={feed.data?.pages || []}
          topics={topics}
          dialogRef={LoginPopupRef}
          fetchNextPage={feed.fetchNextPage}
          hasNextPage={feed.hasNextPage}
          isFetchingNextPage={feed.hasNextPage}
        />
      </section>
    </main>
  );
};
export default index;
