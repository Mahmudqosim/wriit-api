import { ApolloServer } from "apollo-server-express"
import express from "express"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import helment from "helmet"
import cors from "cors"
// import depthLimit from "graphql-depth-limit"
// import { createComplexityLimitRule } from "graphql-validation-complexity"

import * as db from "./db/db.js"
import { models } from "./models/index.js"
import { typeDefs } from "./schema.js"
import resolvers from "./resolvers/index.js"

const app = express()

app.use(helment())
app.use(cors())

dotenv.config()

const port = process.env.PORT || 3030
const DB_HOST = process.env.DB_HOST

db.connect(DB_HOST)

const getUser = (token) => {
  if (token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      throw new Error("Session Invalid")
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
  context: ({ req }) => {
    const token = req.headers.authorization

    const user = getUser(token)

    return { models, user }
  },
})

await server.start()

server.applyMiddleware({ app, path: "/api" })

app.listen({ port }, () => {
  console.log(
    `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
  )
})
