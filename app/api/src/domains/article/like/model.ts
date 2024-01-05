import mongoose from "mongoose";
//Bucket design the likes limt foreach document is 50 
const Schema = new mongoose.Schema({
    article: {
        type: String,
        required: true,
        index: true,
    },
    articlePublisher: {
        type: String,
        required: true,
        index: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        // unique:true,
    },
    createdAt:{
        type: Date,
        required: true,
    },
});
type LikeType = mongoose.InferSchemaType<typeof Schema>;
const Like = mongoose.model<LikeType>('Like', Schema);
export default Like;
