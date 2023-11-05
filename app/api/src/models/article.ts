import mongoose from "mongoose";
const Schema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:true,
    },
    publisher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: Object,
        required: true
    },
    collaborators: {
        type: [
            {
                createdAt: Date,
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                }
            }
        ]
    },
    interests: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Interest'
            }
        ],
        required: true
    },
    estimatedReadTime: { // Content words divided by 300
        type: String,
        required: true
    },
    likesCount:{
        type:Number,
        default:0,
    },
    savedCount:{
        type:Number,
        default:0,
    },
    commentsCount:{
        type:Number,
        default:0,
    },
    createdAt: {
        type: Date,
        required: true
    },
});
type ArticleType = mongoose.InferSchemaType<typeof Schema>;
const Article = mongoose.model<ArticleType>('Article', Schema);
export default Article;
