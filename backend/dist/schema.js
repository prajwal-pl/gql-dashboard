"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
exports.typeDefs = `#graphql
  scalar DateTime

  enum Role {
    STUDENT
    TEACHER
    ADMIN
  }

  type User {
    id: ID!
    email: String!
    name: String!
    bio: String
    role: Role!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type DashboardStats {
    totalUsers: Int!
    totalTeachers: Int!
    totalStudents: Int!
  }

  input RegisterInput {
    email: String!
    name: String!
    password: String!
    role: Role! 
    bio: String
  }

  type AuthOutput {
    token: String!
    user: User!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateProfileInput {
    name: String
    bio: String
    email: String
  }

  type Query {
    me: User
    dashboardStats: DashboardStats!
  }

  type Mutation {
    register(input: RegisterInput!): AuthOutput!
    login(input: LoginInput!): AuthOutput!
    updateProfile(input: UpdateProfileInput!): User!
    changePassword(currentPassword: String!, newPassword: String!): Boolean!
  }
`;
