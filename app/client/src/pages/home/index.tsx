import { useRef } from "react";
import Header from "../../components/Header";
import CreateAccountPop from "../../components/CreateAccountPop";
import WelcomeSection from "./components/WelcomeSection";
import { IArticle } from "../../interfaces/global";
import TopArticlesSection from "./components/TopArticlesSection";
import ArticlesSection from "./components/ArticlesSection";
import { useGetArticleQuery } from "../../store/services/article";
const index = () => {
  const createAccountRef = useRef<HTMLDialogElement>(null);  
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
    {
      _id: "7",
      title: "اشبع فضولك. تسلم الدفة و ابحر في عالم من الخبرات",
      subTitle: " 7اشبع فضولك. تسلم الدفة و ابحر في عالم من الخبرات",
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
      _id:"1",
      title: "علوم",
    },
    {
      _id:"2",
      title: "برمجة",
    },
    {
      _id:"3",
      title: "تكنولوجيا",
    },
    {
      _id:"4",

      title: "تعليم",
    },
    {
      _id:"5",
      title: "تصميم",
    },
    {
      _id:"6",
      title: "تصميم داخلي",
    },
  ];
  return (
    <div className="w-[100vw] h-fit text-center">
      <CreateAccountPop ref={createAccountRef} />
      <main>
        <WelcomeSection />
        <TopArticlesSection articles={articles} />
        <ArticlesSection articles={articles} topics={topics} dialogRef={createAccountRef}/>
      </main>
    </div>
  );
};
export default index;
