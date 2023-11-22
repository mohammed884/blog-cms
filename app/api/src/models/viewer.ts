import mongoose from "mongoose";
//Bucket design the viewers limt foreach document is 100 
const Schema = new mongoose.Schema({
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    },
    viewers:{
        type:[{
            viewer:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            createdAt:{
                type: Date,
                required: true
            },
        }],
    },
    count:{
        type: Number,
        default: 100
    },
});
Schema.set("timestamps", true);
type ViewerType = mongoose.InferSchemaType<typeof Schema>;
const Viewer = mongoose.model<ViewerType>('Viewer', Schema);
export default Viewer
