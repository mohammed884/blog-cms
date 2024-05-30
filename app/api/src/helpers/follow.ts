import Follow from "../domains/user/follow/model";
import { ObjectId } from "bson";

// interface ICheckFollowingStatusProps {
//     requestSenderId: ObjectId,
//     requestReciverId: ObjectId
// }
interface ICheckFollowingStatusReturnValue {
    youFollowing: boolean,
    isFollowingYou: boolean
}
interface ICheckMultiableFollowingStatusReturnValue {
    requestReciverFollowingList: Array<{ followedBy: ObjectId }>,
    requestSenderFollowingList: Array<{ user: ObjectId }>
}
interface ITransformDataProps {
    data: Array<any>,
    requestSenderFollowingList: Array<{ user: ObjectId }> | null,
    requestReciversFollowingList: Array<{ followedBy: ObjectId }> | null,
}
const requestSenderAndReciverFollowingStatus = async (requestSenderId: ObjectId, requestReciverId: ObjectId): Promise<ICheckFollowingStatusReturnValue> => {
    const isFollowingYou = await Follow.findOne({
        user: requestSenderId,
        followedBy: requestReciverId
    }).lean() ? true : false;
    const youFollowing = await Follow.findOne({
        user: requestReciverId,
        followedBy: requestSenderId
    }).lean() ? true : false;
    return { youFollowing, isFollowingYou }
};
const getRequestSenderAndReciverFollowingList = async (requestSenderId: ObjectId, requestReciversIds: Array<ObjectId>): Promise<ICheckMultiableFollowingStatusReturnValue> => {
    const requestReciverFollowingList: Array<{ followedBy: ObjectId }> = await Follow.find({
        user: requestSenderId,
        followedBy: { $in: requestReciversIds }
    }).select("-_id followedBy").lean();
    const requestSenderFollowingList: Array<{ user: ObjectId }> = await Follow.find({
        user: { $in: requestReciversIds },
        followedBy: requestSenderId,
    }).select("-_id user").lean();
    return { requestReciverFollowingList, requestSenderFollowingList };
};
const getRequestSenderFollowingList = async (requestSenderId: ObjectId, requestReciversIds: Array<ObjectId>): Promise<Array<{ user: ObjectId }>> => {
    const requestSenderFollowingList: Array<{ user: ObjectId }> = await Follow.find({
        user: { $in: requestReciversIds },
        followedBy: requestSenderId,
    }).select("-_id user").lean();
    return requestSenderFollowingList;
};
const getRequestReciversFollowingList = async (requestSenderId: ObjectId, requestReciversIds: Array<ObjectId>): Promise<Array<{ followedBy: ObjectId }>> => {
    const requestReciversFollowingList: Array<{ followedBy: ObjectId }> = await Follow.find({
        user: requestSenderId,
        followedBy: { $in: requestReciversIds }
    }).select("-_id followedBy").lean();
    return requestReciversFollowingList;
}
const isFollowingYou = (requestReciversFollowingList: Array<{ followedBy: ObjectId }>, requestSenderId: ObjectId | string): boolean => {
    return requestReciversFollowingList.findIndex((f) => String(f.followedBy) === String(requestSenderId)) > -1 ? true : false;
}
const youFollowing = (requestSenderFollowingList: Array<{ user: ObjectId }>, requestSenderId: ObjectId | string): boolean => {
    return requestSenderFollowingList.findIndex((f) => String(f.user) === String(requestSenderId)) > -1 ? true : false;
}
const transformFollowingStatus = ({
    data,
    requestSenderFollowingList,
    requestReciversFollowingList }: ITransformDataProps,
) => {
    if (requestSenderFollowingList?.length > 0 && requestReciversFollowingList?.length > 0) {
        //this works every where when the request sender is not the same as the request receiver
        return data.map((follow) => {
            return {
                ...follow,
                isFollowingYou: isFollowingYou(requestReciversFollowingList, follow.user._id),
                youFollowing: youFollowing(requestSenderFollowingList, follow.followedBy._id)
            };
        })
    }
    if (requestReciversFollowingList) {
        //this case works for the following route (if the request sender is the request receiver)
        return data.map((follow) => {
            return {
                ...follow,
                youFollowing: true,
                isFollowingYou: isFollowingYou(requestReciversFollowingList, follow.user._id),
            };
        })
    };
    if (requestSenderFollowingList) {
        //this case works for the followers route (if the request sender is the request receiver)
        return data.map((follow) => {
            return {
                ...follow,
                isFollowingYou: true,
                youFollowing: youFollowing(requestSenderFollowingList, follow.followedBy._id)
            };
        })
    };
}
export {
    requestSenderAndReciverFollowingStatus,
    getRequestSenderAndReciverFollowingList,
    getRequestSenderFollowingList,
    getRequestReciversFollowingList,
    transformFollowingStatus,
    isFollowingYou,
    youFollowing
};