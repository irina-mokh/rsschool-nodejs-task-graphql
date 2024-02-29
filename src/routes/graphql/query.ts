import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import prisma from './prisma.js';
import { MemberType as Member, Post, Profile, User } from '@prisma/client';
import { UUIDType } from './types/uuid.js';
import { UserType } from './types/user.js';
import { MemberType, MemberTypeId } from './types/member.js';
import { ProfileType } from './types/profile.js';
import { PostType } from './types/post.js';

export const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    users: {
      type: new GraphQLList(UserType),
      resolve: () => prisma.user.findMany(),
    },

    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType)},
      },
      resolve: async (_, { id }: User) =>
        await prisma.user.findUnique({
          where: { id },
        }),
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: () => prisma.post.findMany(),
    },

    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType)},
      },
      resolve: async (_, { id }: Post) =>
        await prisma.post.findUnique({
          where: { id },
        }),
    },

    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: () => prisma.memberType.findMany(),
    },

    memberType: {
      type: MemberType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeId)},
      },
      resolve: async (_, { id }: Member) =>
        await prisma.memberType.findUnique({
          where: { id },
        }),
    },

    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: () => prisma.profile.findMany(),
    },

    profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType)},
      },
      resolve: async (_, { id }: Profile) =>
        await prisma.profile.findUnique({
          where: { id },
        }),
    },
  }),
});
