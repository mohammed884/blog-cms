import mongoose from 'mongoose';
const Schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    followedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // unique:true,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    }
});
type FollowType = mongoose.InferSchemaType<typeof Schema>;
const Follow = mongoose.model<FollowType>('Follow', Schema);
export default Follow;
