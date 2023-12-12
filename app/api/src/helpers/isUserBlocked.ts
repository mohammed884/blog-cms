import { ObjectId } from "mongoose";

const isUserBlocked = (list: Array<{ user: ObjectId, createdAt: Date }>, userIdToCheck: ObjectId | string): boolean => {
    if (!list || !userIdToCheck) return false;
    const isBlocked = list.some((block) => String(block.user) === String(userIdToCheck));
    return isBlocked
}
export default isUserBlocked