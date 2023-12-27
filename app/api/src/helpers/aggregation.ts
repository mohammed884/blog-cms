import { ObjectId } from "bson"

/*
 $lookup: {
      from: "orders", collection to lokup from
      localField: "customerId", field that have the collection refrence
      foreignField: "_id", the field that have the refrence in the other collection
      as: "customerOrders", field name to display the results
    }
*/
interface IPaginationOptions {
    Model: any,
    page: number,
    limit?: number
    matchQuery?: {},
    populate?: {
        from: string,
        localField: string,
        as: string,
        foreignField: "_id" | "",
        select?: {
            _id?: 1 | 0,
            username?: 1 | 0
            avatar?: 1 | 0
            blocked?: 1 | 0
            createdAt?: 1 | 0
        },
    },
    articleBlockChecking?: {
        userIdToCheck: ObjectId,
    },
};
interface ICountDataOptions {
    Model: any,
    matchQuery?: {},
    countDocuments?: boolean,
    countArrayElements?: "comments" | "likes" | "followers" | "notifications",
    countUnSeenNotifications?: boolean,
}
export const pagination = async ({ matchQuery,
    page = 1,
    limit = 10,
    populate,
    articleBlockChecking,
    Model }: IPaginationOptions) => {
    const skip = (Number(page) - 1) * limit;
    let pipeline: Array<Object> = [
        { $match: matchQuery },
    ];
    if (populate) {
        const { select, ...rest } = populate;
        const lookup = {
            ...rest,
            ...(select && { pipeline: [{ $project: select }] }),
        };
        pipeline = [
            ...pipeline,
            { $unwind: `$${populate.localField}` },
            { $lookup: lookup }
        ]
    }
    if (articleBlockChecking && articleBlockChecking.toString() !== "{}") {
        pipeline = [
            ...pipeline,
            {
                $match: {
                    "publisher.blocked": {
                        $not: {
                            $elemMatch: {
                                userId: articleBlockChecking.userIdToCheck
                            }
                        }
                    }
                }
            },
        ]
    }
    pipeline = [
        ...pipeline,
        {
            $facet: {
                data: [
                    { $skip: skip },
                    { $limit: limit },
                ],
            },
        },
    ]
    const result = await Model.aggregate(pipeline);
    const { data } = result[0];
    return { data };
}
export const countData = async ({ matchQuery,
    Model,
    countDocuments = false,
    countArrayElements,
    countUnSeenNotifications = false }: ICountDataOptions) => {
    let pipeline: Array<unknown> = [
        { $match: matchQuery },
    ];
    if (countDocuments) {
        pipeline = [
            ...pipeline,
            {
                $count: 'documentsCount',
            }
        ]
    }
    if (countArrayElements) {
        pipeline = [
            ...pipeline,
            {
                $unwind: `$${countArrayElements}`,
            },
            {
                $group: { _id: null, arrayElementsCount: { $sum: 1 } },
            },
        ];
    };
    if (countUnSeenNotifications) {
        pipeline = [
            ...pipeline,
            {
                $unwind: "notifications",
            },
            { $match: { "notifications.seen": false } },
            {
                $group: { _id: null, unSeenNotifications: { $sum: 1 } },
            },

        ];
    };

    const result = await Model.aggregate(pipeline);
    const documentsCount = result[0] && result[0].documentsCount ? result[0].documentsCount : 0;
    const arrayElementsCount = result[0] && result[0].arrayElementsCount ? result[0].arrayElementsCount : 0;
    const unSeenNotifications = result[0] && result[0].unSeenNotifications ? result[0].unSeenNotifications : 0
    return { documentsCount, arrayElementsCount, unSeenNotifications };
}