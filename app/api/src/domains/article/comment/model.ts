import mongoose from "mongoose";
// bucket pattren, 50 is the limt
const Schema = new mongoose.Schema({
  //if you add the article publisher you can do content checking with ease
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
  comments: {
    type: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          auto: true
        },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type:String,
          required: true,
          trim: true,
        },
        likes: {
          type: [{ _id: { type: String } }],
          default: [],
          required: true,
        },
        replies: {
          type: [
            {
              _id: {
                type: mongoose.Schema.Types.ObjectId,
                auto: true
              },
              author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
              text: { type: String, required: true },
              createdAt: { type: Date, required: true },
            },
          ],
        },
        createdAt: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  commentsCount: {
    type: Number,
    default: 0,
    max: 5,
  },
  createdAt: {
    type: Date,
    required: true,
  }
});
type CommentType = mongoose.InferSchemaType<typeof Schema>;

const Comment = mongoose.model<CommentType>("Comment", Schema);
export default Comment;
