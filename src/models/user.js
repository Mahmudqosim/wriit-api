import mongoose from "mongoose"

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: { unique: true },
    },
    email: {
      type: String,
      required: true,
      index: { unique: true },
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      data: String,
    },
    bio: {
      type: String,
      default: '',
      maxLength: 250
    },
  },

  { timestamps: true }
)

export const User = mongoose.model("User", UserSchema)
