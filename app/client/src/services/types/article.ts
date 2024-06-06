export interface IPublishArticleBody {
    title: string;
    subTitle: string;
    cover: File | undefined;
    topics: Array<string>;
    content: string;
};