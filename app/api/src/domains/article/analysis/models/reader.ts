import mongoose from "mongoose";
//Bucket design the readers limt foreach document is 100 
const Schema = new mongoose.Schema({
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    },
    readers: {
        type: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                },
                data: {
                    createdAt: Date,
                    required: true
                }
            }
        ]
    },
    count: {
        type: Number,
        default: 100
    },
})
Schema.set("timestamps", true);
type ReaderType = mongoose.InferSchemaType<typeof Schema>;
const Reader = mongoose.model<ReaderType>('Reader', Schema);
export default Reader;
