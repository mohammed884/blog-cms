import { ObjectId } from "bson"
interface IPaginationOptions {
    Model: any,
    page: number,
    limit?: number
    matchQuery?: {},
    populate?: {
        unwindField?: string
        from: string,
        localField: string,
        as: string,
        foreignField: "_id" | "",
        select?: {
            _id?: 1 | 0,
            username?: 1 | 0
            avatar?: 1 | 0
            blocked?: 1 | 0
            createdAt?: 1 | 0,
            bio?: 1 | 0
        },
    },
    select?: Object,
    articleBlockChecking?: {
        userIdToCheck?: ObjectId,
    },
};
const pagination = async ({
    matchQuery,
    page = 1,
    limit = 10,
    populate,
    articleBlockChecking,
    select,
    Model }: IPaginationOptions) => {
    try {
        const skip = (Number(page) - 1) * limit;
        let pipeline: Array<Object> = [{ $match: matchQuery || {} }];

        if (populate) {
            const { select, unwindField, ...rest } = populate;
            if (unwindField) {
                pipeline = [
                    ...pipeline,
                    { $unwind: `$${unwindField}` },
                ]
            }
            const lookup = {
                ...rest,
                ...(select && { pipeline: [{ $project: select }] }),
            };
            pipeline = [
                ...pipeline,
                { $lookup: lookup },
                { $unwind: `$${populate.as}` },
            ];
            if (unwindField) {
                pipeline = [
                    ...pipeline,
                    {
                        $group: {
                            _id: null,
                            [unwindField]: { $push: `$${unwindField}` }
                        }
                    }
                ]
            }
        };
        if (articleBlockChecking && articleBlockChecking.toString() !== "{}") {
            pipeline = [
                ...pipeline,
                {
                    $match: {
                        "publisher.blocked": {
                            $not: {
                                $elemMatch: {
                                    user: articleBlockChecking.userIdToCheck
                                },
                            }
                        }
                    },
                }
            ]
        };
        if (select) {
            pipeline = [...pipeline, { $project: select }];
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
            }
        ];
        const result = await Model.aggregate(pipeline);
        const { data } = result[0];
        return { data };
    } catch (error) {
        console.log(error);
    }
}
export default pagination;