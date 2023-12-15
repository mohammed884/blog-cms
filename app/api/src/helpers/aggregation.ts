interface IPaginationOptions {
    Model: any,
    page: number,
    limt?: number
    matchQuery?: {},
    populate?:string
};

interface ICountDataOptions {
    Model: any,
    matchQuery?: {},
    countDocuments?: boolean,
    countArrayElements?: "comments" | "likes" | "followers" | "notifications",
    countUnSeenNotifications?: boolean
}
export const pagination = async ({ matchQuery, Model, page = 1, limt = 10 }: IPaginationOptions) => {
    const skip = (Number(page) - 1) * limt;
    const pipeline = [
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
        }
    ];
    const result = await Model.aggregate(pipeline);
    return { data: result[0].data };
}
export const countData = async ({ matchQuery, Model, countDocuments = false, countArrayElements, countUnSeenNotifications = false }: ICountDataOptions) => {
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
//add counting all of the documents array elements
/*
  {$unwind: '$foo'},
{$group: {_id: '$_id', 'sum': { $sum: 1}}},
{$group: {_id: null, total_sum: {'$sum': '$sum'}}}
*/
/*
    switch (true as any) {
     case countUnSeenNotifications:
         console.log(countUnSeenNotifications);
         pipeline[1].$facet = {
             ...pipeline[1].$facet,
             totalArrayElementsCount: [
                 {
                     $unwind: "notifications",
                 },
                 { $match: { "notifications.seen": false } },
                 {
                     $group: { _id: null, count: { $sum: 1 } },
                 },
             ],
         };
     default:
         console.log("ha");
 
 }
 
 
*/