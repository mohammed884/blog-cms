import mongoose from "mongoose";
const Schema = new mongoose.Schema({
  name: {
    type: String,
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
    type: String,
    trim: true,
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
  blockedUsers: {
    type: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  createdAt: {
    type: Date,
    required: true,
  },
});
Schema.index({ email: 1 }, { unique: true });
type UserType = mongoose.InferSchemaType<typeof Schema>;
const User = mongoose.model<UserType>("User", Schema);
export default User;
