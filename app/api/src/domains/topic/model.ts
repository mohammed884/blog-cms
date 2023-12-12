import mongoose from "mongoose";
const Schema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  subTopics: {
    type: [
      {
        title: {
          type: String,
          trim: true,
          unique: true,
          required: true,
        },
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          auto:true,
        },
      },
    ],
  },
});
Schema.set("timestamps", true);
type topicType = mongoose.InferSchemaType<typeof Schema>;
const Topic = mongoose.model<topicType>("Topic", Schema);

export default Topic;
