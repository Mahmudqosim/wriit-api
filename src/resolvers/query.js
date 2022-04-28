export default {
  notes: async (parent, args, { models }) => {
    return await models.Note.find().limit(100)
  },

  note: async (parent, { id }, { models }) => {
    return await models.Note.findById(id)
  },

  user: async (parent, { username }, { models }) => {
    return await models.User.findOne({ username })
  },

  users: async (parent, args, { models }) => {
    return await models.User.find({})
  },

  me: async (parent, args, { models, user }) => {
    return await models.User.findById(user.id)
  },

  noteFeed: async (parent, { cursor }, { models }) => {
    const NOTE_LIMIT = 10

    let hasNextPage = false

    let cursorQuery = {}

    if (cursor) {
      cursorQuery = { _id: { $lt: cursor } }
    }

    let notes = await models.Note.find(cursorQuery)
      .sort({ _id: -1 })
      .limit(NOTE_LIMIT + 1)

    if (notes.length > NOTE_LIMIT) {
      hasNextPage = true

      notes = notes.slice(0, -1)
    }

    const newCursor = notes[notes.length - 1]._id

    return {
      notes,
      cursor: newCursor,
      hasNextPage,
    }
  },
}
