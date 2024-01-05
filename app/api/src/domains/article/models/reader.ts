import mongoose from "mongoose";
//Bucket design the readers limt foreach document is 100 
const Schema = new mongoose.Schema({
    article: {
        type: String,
        index: true,
        required: true
    },
    articlePublisher: {
        type: String,
        index: true,
        required: true
    },
    user: {
        type: String,
        required: true,
        unique: true,
    },
    readTime: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true
    }
});
type ReaderType = mongoose.InferSchemaType<typeof Schema>;
const Reader = mongoose.model<ReaderType>('Reader', Schema);
export default Reader;
