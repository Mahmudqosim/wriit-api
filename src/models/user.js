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
    avatar: String,
  },
  { timestamps: true }
)

export const User = mongoose.model('User', UserSchema)