import { ObjectId } from "mongoose";
// const checkIfBlocked = async (user: any, queryField: string) => {
//     let isBlocked = false;
//     const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
//     const cachedBlockedFromList: Array<{ _id: string, username: string }> = cache.get(String(user._id)) || [];
//     isBlocked = cachedBlockedFromList?.some(u => String(u[queryField]) === searchQuery[queryField]);

//     if (isBlocked) return true;

//     const requestedUser = await findRequestedUser(searchQuery);
//     if (!requestedUser) return false;

//     isBlocked = requestedUser.blocked.some(u => String(u.user) === String(user._id));
//     if (isBlocked) {
//         cache.set(String(user._id), [...cachedBlockedFromList, { _id: requestedUser._id, username: requestedUser.username }], thirtyDaysMs);
//     }

//     return isBlocked;
// };
const isUserBlocked = (list: Array<{ user: ObjectId, createdAt: Date }>, userIdToCheck: ObjectId | string): boolean => {
    if (!list || !userIdToCheck) return false;
    const isBlocked = list.some((block) => String(block.user) === String(userIdToCheck));
    return isBlocked
}
export default isUserBlocked