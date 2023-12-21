import mongoose from "mongoose";
const Schema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  cover: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin", "moderator"],
    required: true,
  },
  bio: {
    type: {
      text: {
        type: String,
        trim: true,

      },
      title: {
        type: String,
        trim: true,
      }
    },
    default: {},
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  location: {
    type: String,
    // required: true
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  birthdate: {
    type: String,
    required: true,
  },
  saved: {
    type: [
      {
        createdAt: {
          type: Date,
          required: true,
        },
        article: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Article",
          required: true,
        },
      },
    ],
    default:[],
  },
  blocked: {
    type: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      createdAt: {
        type: Date,
        required: true,
      },
    }],
  },
  blackListed: {
    blackListedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reason: {
      type: String,
    },
    period: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
  },
  topics:{
    type: [
      {
        title:{
          type:String,
          required:true,
        },
      }
    ],
    default: [],
  }
});
Schema.set("timestamps", true);
Schema.index({ email: 1 });
Schema.index({ username: 1 });
type UserType = mongoose.InferSchemaType<typeof Schema>;
const User = mongoose.model<UserType>("User", Schema);
export default User;
