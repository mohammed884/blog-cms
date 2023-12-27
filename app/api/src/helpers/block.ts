import { getCache } from "./node-cache";
interface ISearchQuery {
    _id?: string;
    username?: string;
};
const checkCache = (searchQuery: ISearchQuery, userIdToCheck: any, queryField: string) => {
    let isBlocked: boolean;
    const cachedBlockedFromList: any = getCache(String(userIdToCheck)) || [];
    isBlocked = cachedBlockedFromList?.some(u => u[queryField] === searchQuery[queryField]);
    return { isBlocked, cachedBlockedFromList }
};
const buildSearchQuery = (queryField: string, requestedDataField: string, requestedDataInfo: string) => {
    const field = queryField || requestedDataField;
    return { [field]: requestedDataInfo };
};
const isValidSearchQuery = (searchQuery: ISearchQuery) => {
    return searchQuery._id || searchQuery.username;
};
const isSameUser = (searchQuery: ISearchQuery, user: any) => {
    return searchQuery._id === user._id || searchQuery.username === user.username;
};
const checkBlockedList = (list: any[], userIdToCheck: string): boolean => {
    if (!list || !userIdToCheck) return false;
    const isBlocked = list.some((block) => (String(block.user) === userIdToCheck));    
    return isBlocked;
};
export {
    checkCache,
    buildSearchQuery,
    isValidSearchQuery,
    isSameUser,
    checkBlockedList
}