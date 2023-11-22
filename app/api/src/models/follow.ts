import mongoose from 'mongoose';
const Schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    followers: {
        type: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                createdAt: {
                    type: Date,
                    required: true
                }
            },
        ],
    },
    followersCount: {
        type: Number,
        default: 100
    },
});
Schema.set("timestamps", true)
type FollowType = mongoose.InferSchemaType<typeof Schema>;
const Follow = mongoose.model<FollowType>('Follow', Schema);
export default Follow;
