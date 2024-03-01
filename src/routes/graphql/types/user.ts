import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profile.js';
import prisma from '../prisma.js';
import { PostType } from './post.js';
import { User } from '@prisma/client';

const userFields = {
  name: { type: GraphQLString },
  balance: { type: GraphQLFloat },
}

export const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    ...userFields,

    profile: {
      type: ProfileType,
      resolve: async ({ id }: User) =>
        await prisma.profile.findUnique({
          where: { userId: id },
        }),
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: async ({ id }: User) =>
        await prisma.post.findMany({
          where: { authorId: id },
        }),
    },

    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async ({ id }: User) =>
        await prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: id,
              },
            },
          },
        }),
    },

    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async ({ id }: User) =>
        await prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: id,
              },
            },
          },
        }),
    },
  }),
});

export interface CreateUser {
  dto: Omit<User, 'id'>
}

export interface ChangeUser extends CreateUser {
  id: string,
}

export const CreateUserType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

export const ChangeUserType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});