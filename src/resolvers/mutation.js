import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { AuthenticationError, ForbiddenError } from "apollo-server-express"
import dotenv from "dotenv"
import { gravatar } from "../util/gravatar.js"
import mongoose from "mongoose"

dotenv.config()

export default {
  newNote: async (parent, { title, content }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError("You must be signed in to create a note!")
    }

    return await models.Note.create({
      title,
      content,
      author: mongoose.Types.ObjectId(user.id),
    })
  },

  deleteNote: async (parent, { id }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError("You must be signed in to create a note!")
    }

    const note = await models.Note.findById(id)

    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError("You don't have permissions to delete the note")
    }

    try {
      await note.remove()

      return true
    } catch (err) {
      console.log(err)
      return false
    }
  },

  updateNote: async (parent, { id, title, content }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError("You must be signed in to create a note!")
    }

    const note = await models.Note.findById(id)

    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError("You don't have permissions to update the note")
    }

    return await models.Note.findOneAndUpdate(
      { _id: id },
      { $set: { title, content } },
      { new: true }
    )
  },

  // Authentication

  signUp: async (parent, { username, email, password }, { models }) => {
    // Normalize Email Address
    email = email.trim().toLowerCase()

    // Hash Password
    const hashed = await bcryptjs.hash(password, 12)

    const avatar = gravatar(email)

    try {
      const user = await models.User.create({
        username,
        email,
        password: hashed,
        avatar,
      })

      return jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    } catch (err) {
      console.error(err)

      throw new Error("Error creating an account.")
    }
  },

  signIn: async (parent, { username, email, password }, { models }) => {
    if (email) email = email.trim().toLowerCase()

    const user = await models.User.findOne({
      $or: [{ email }, { username }],
    })

    if (!user)
      throw new AuthenticationError("Error with Email Address or Password")

    const isPasswordValid = await bcryptjs.compare(password, user.password)

    if (!isPasswordValid)
      throw new AuthenticationError("Error with Email Address or Password")

    return jwt.sign({ id: user.id }, process.env.JWT_SECRET)
  },

  toggleFavorite: async (parent, { id }, { models, user }) => {
    if(!user) throw new AuthenticationError()

    let note = await models.Note.findById(id)
    const hasUser = await note.favoritedBy.indexOf(user.id)

    if(hasUser >= 0) {
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $pull: {
            favoritedBy: mongoose.Types.ObjectId(user.id)
          },
          $inc: {
            favoriteCount: -1
          }
        },
        {
          new: true
        }
      )

    } else {

      return await models.Note.findByIdAndUpdate(
        id,
        {
          $push: {
            favoritedBy: mongoose.Types.ObjectId(user.id)
          },
          $inc: {
            favoriteCount: 1
          }
        },
        {
          new: true
        }
      )
    }
  }
}
