import mongoose from "mongoose";
//Bucket design the likes limt foreach document is 50 
const Schema = new mongoose.Schema({
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    },
    likes: {
        type: [
            {
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
    likesCount:{
        type:Number,
        default:1
    },
});
Schema.set("timestamps", true);
type LikeType = mongoose.InferSchemaType<typeof Schema>;
const Like = mongoose.model<LikeType>('Like', Schema);
export default Like;
