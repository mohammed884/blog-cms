import mongoose from "mongoose";
// bucket pattren, 50 is the limt
const Schema = new mongoose.Schema({
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Article",
    required: true,
  },
  comments: {
    type: [
      {
        _id:{
          type: mongoose.Schema.Types.ObjectId,
          auto:true
        },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
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
                auto:true
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
  },
});
Schema.set("timestamps", true);
type CommentType = mongoose.InferSchemaType<typeof Schema>;

const Comment = mongoose.model<CommentType>("Comment", Schema);
export default Comment;
