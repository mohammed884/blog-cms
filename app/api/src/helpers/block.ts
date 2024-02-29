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
const isSameUser = (searchQuery: ISearchQuery, user: any) => {
    return searchQuery._id === String(user._id) || searchQuery.username === user.username;
};
export {
    buildSearchQuery,
    isValidSearchQuery,
    isSameUser,
}