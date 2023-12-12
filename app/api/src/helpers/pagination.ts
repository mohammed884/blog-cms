interface IOptions {
    Model: any,
    page?: number,
    limt?: number
    matchQuery?: {},
    countDocuments?: boolean,
    countArrayElements?: "comments" | "likes" | "followers" | "notifications",
}
const pagination = async ({ matchQuery, Model, page = 1, limt = 10, countDocuments = false, countArrayElements }: IOptions) => {
    const skip = (Number(page) - 1) * limt;
    const pipeline: any = [
        { $match: matchQuery },
        {
            $facet: {
                data: [
                    {
                        $skip: skip,
                    },
                    {
                        $limit: limt,
                    },
                ],
            },
        },
    ];
    if (countArrayElements) {
        pipeline[1].$facet = {
            ...pipeline[1].$facet,
            totalArrayElementsCount: [
                {
                    $unwind: `$${countArrayElements}`,
                },
                {
                    $group: { _id: null, count: { $sum: 1 } },
                },
            ],
        };
    }
    if (countDocuments) {
        pipeline[1].$facet = {
            ...pipeline[1].$facet,
            totalCount: [
                {
                    $count: "count",
                },
            ],
        };
    };
    const result = await Model.aggregate(pipeline);
    const totalDocumentsCount = result[0].totalCount ? result[0].totalCount[0].count : 0;
    const totalArrayElementsCount = result[0].totalArrayElementsCount ? result[0].totalArrayElementsCount[0].count : 0
    return { data: result[0].data, totalDocumentsCount, totalArrayElementsCount };
}
export default pagination