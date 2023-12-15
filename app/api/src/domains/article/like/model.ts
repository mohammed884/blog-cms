import mongoose from "mongoose";
//Bucket design the likes limt foreach document is 50 
const Schema = new mongoose.Schema({
    article: {
        type: String,
        required: true,
        index: true,
    },
    likes: {
        type: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    auto: true
                },
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                },
                createdAt: {
                    type: Date,
                    required: true
                }
            }
        ],
    },
    likesCount: {
        type: Number,
        default: 1
    },
});
Schema.set("timestamps", true);
type LikeType = mongoose.InferSchemaType<typeof Schema>;
const Like = mongoose.model<LikeType>('Like', Schema);
export default Like;
