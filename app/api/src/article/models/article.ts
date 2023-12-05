import mongoose from "mongoose";
const Schema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: Object,
    required: true,
  },
  collaborators: {
    type: [
      {
        _id:{
          type: mongoose.Schema.Types.ObjectId,
          auto:true,
        },
        collaborator: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        accepted: {
          type: Boolean,
          default: false,
        },
        canDelete:{
          type:Boolean,
          default:false
        },
        createdAt: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  topics: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
        required: true,
      },
    ],
  },
  estimatedReadTime: {
    // Content words divided by 300
    type: String,
    required: true,
  },
  cover: {
    type: String,
  },
  likesCount: {
    type: Number,
    default: 0,
  },
  savedCount: {
    type: Number,
    default: 0,
  },
  commentsCount: {
    type: Number,
    default: 0,
  },
});
Schema.set("timestamps", true);
type ArticleType = mongoose.InferSchemaType<typeof Schema>;
const Article = mongoose.model<ArticleType>("Article", Schema);
export default Article;
