import mongoose from 'mongoose';
//Bucket design the notifications limt foreach document is 50 
const Schema = new mongoose.Schema({
    followed:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    followedBy:{
        type:[
            {
                followedBy:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                createdAt: {
                    type: Date,
                    required: true
                }
            },
        ],
        // validate: [50, '{PATH} exceeds the limit of 50']
    },
    count:{
        type:Number,
        default:50
    },
    createdAt:{
        type:Date,
        required: true
    }
});
type FollowType = mongoose.InferSchemaType<typeof Schema>;
const Follow = mongoose.model<FollowType>('Notification', Schema);
export default Follow;
