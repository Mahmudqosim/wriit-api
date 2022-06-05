import mongoose from "mongoose"

export const connect = (DB_HOST) => {
  // Connect to the DB
  mongoose.connect(DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  mongoose.connection.on("error", (err) => {
    console.error(err)

    console.log(
      "MongoDB connection error. Please make sure MongoDB is running."
    )
    process.exit()
  })
}

export const close = () => {
  mongoose.connection.close()
}
