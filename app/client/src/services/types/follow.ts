export interface IFollowErrorBody {
    success: false;
    message: string;
}
export interface IFollowData {
    userId: string;
    ownerId: string;
    ownerUsername?: string;
    action: "follow" | "un-follow";
    viewerId?: string;
    pageIndex?: number;
    followIndex?: number;
    page?: "followers" | "following"
}
export interface ISavedArticle {
    _id: string;
    title: string;
    publisher: {
        _id: string;
        username: string;
    },
    cover: string;
    subTitle: string;
}