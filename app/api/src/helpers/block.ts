import { IUser } from "interfaces/global";

interface ISearchQuery {
    _id?: string;
    username?: string;
};
const buildSearchQuery = (queryField: string, requestedDataField: string, requestDataIdentifier: string) => {
    const field = queryField || requestedDataField;
    return { [field]: requestDataIdentifier };
};
const isValidSearchQuery = (searchQuery: ISearchQuery) => {
    return searchQuery._id || searchQuery.username;
};
const isSameUser = (searchQuery: ISearchQuery, user: IUser) => {
    return searchQuery._id === String(user._id) || searchQuery.username === user.username || searchQuery.username === "profile";
};
export {
    buildSearchQuery,
    isValidSearchQuery,
    isSameUser,
}