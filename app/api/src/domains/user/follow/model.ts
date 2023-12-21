import mongoose from 'mongoose';
const Schema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        index: true
    },
    followedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique:true,
        required: true,
    }
});
Schema.set("timestamps", true)
type FollowType = mongoose.InferSchemaType<typeof Schema>;
const Follow = mongoose.model<FollowType>('Follow', Schema);
export default Follow;
