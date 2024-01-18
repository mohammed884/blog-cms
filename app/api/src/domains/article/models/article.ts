import mongoose from "mongoose";
const Schema = new mongoose.Schema({
  //i need to put the article owner for lock checking
  title: {
    type: String,
    trim: true,
    required: true,
  },
  subTitle: {
    type: String,
    trim: true,
    required: true,
  },
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true,
    required: true,
  },
  content: {
    type: Object,
    required: true,
  },
  collaborators: {
    type: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          auto: true,
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
        canDelete: {
          type: Boolean,
          default: false
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
        mainTopic: {
          type: String,
          required: true
        },
        subTopic: {
          type: String,
        }
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
    default: "",
  },
  savedCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    required:true,
  },
});
type ArticleType = mongoose.InferSchemaType<typeof Schema>;
const Article = mongoose.model<ArticleType>("Article", Schema);
export default Article;
