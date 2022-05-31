import { gql } from "apollo-server-express"

export const typeDefs = gql`
  scalar DateTime

  type Query {
    notes: [Note]
    note(id: ID!): Note!
    user(username: String!): User
    users: [User!]!
    me: User
    noteFeed(cursor: String): NoteFeed
  }

  type Note {
    id: ID!
    title: String!
    content: String!
    image: String
    author: User!
    createdAt: DateTime!
    updatedAt: DateTime!
    favoriteCount: Int!
    favoritedBy: [User]
  }

  type Mutation {
    newNote(title: String!, content: String!, image: String): Note!
    updateNote(id: ID!, title: String!, content: String!, image: String): Note!
    deleteNote(id: ID!): Boolean!
    signUp(username: String!, email: String!, password: String!): String!
    signIn(username: String, email: String, password: String!): String!
    updateUser(id: ID!, avatar: String, username: String!, email: String!, bio: String,): User!
    deleteUser(id: ID!): Boolean!
    toggleFavorite(id: ID!): Note!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String
    notes: [Note!]!
    favorites: [Note!]!
    bio: String
  }

  type NoteFeed {
    notes: [Note]!
    cursor: String!
    hasNextPage: Boolean!
  }
`
