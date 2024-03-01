import {  GraphQLBoolean, GraphQLInputObjectType, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { PostType, CreatePostType, CreatePost, ChangePost, ChangePostType } from './types/post.js';
import prisma from './prisma.js';
import { ChangeProfile, ChangeProfileType, CreateProfile, CreateProfileType, ProfileType } from './types/profile.js';
import { ChangeUser, ChangeUserType, CreateUser, CreateUserType, UserType } from './types/user.js';
import { requiredId } from './types/uuid.js';
import { Post, Profile, User } from '@prisma/client';

const requiredDto = (InputType: GraphQLInputObjectType) =>({ type: new GraphQLNonNull(InputType) });

export const RootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createPost: {
      type: PostType,
      args: {
        dto: requiredDto(CreatePostType),
      },
      resolve: async(_, {dto}: CreatePost) => 
        await prisma.post.create({data: dto})
    },
    createProfile: {
      type: ProfileType,
      args: {
        dto: requiredDto(CreateProfileType),
      },
      resolve: async (_, { dto }: CreateProfile) =>
        await prisma.profile.create({ data: dto }),
    },
    createUser: {
      type: UserType,
      args: {
        dto: requiredDto(CreateUserType),
      },
      resolve: async (_, { dto }: CreateUser) => await prisma.user.create({ data: dto }),
    },

    deleteUser: {
      type: GraphQLBoolean,
      args: {
        id: requiredId,
      },
      resolve: async (_, { id }: User) => {
        await prisma.user.delete({ where: { id } });
        return null;
      },
    },
    deleteProfile: {
      type: GraphQLBoolean,
      args: {
        id: requiredId,
      },
      resolve: async (_, { id }: Profile) => {
        await prisma.profile.delete({ where: { id } });
        return null;
      },
    },
    deletePost: {
      type: GraphQLBoolean,
      args: {
        id: requiredId,
      },
      resolve: async (_, { id }: Post) => {
        await prisma.post.delete({ where: { id } });
        return null;
      },
    },

    changeUser: {
      type: UserType,
      args: {
        id: requiredId,
        dto: requiredDto(ChangeUserType),
      },
      resolve: async (_, { id, dto }: ChangeUser) =>
        await prisma.user.update({
          where: { id },
          data: dto,
        }),
    },
    changeProfile: {
      type: ProfileType,
      args: {
        id: requiredId,
        dto: requiredDto(ChangeProfileType),
      },
      resolve: async (_, { id, dto }: ChangeProfile) =>
        await prisma.profile.update({
          where: { id },
          data: dto,
        }),
    },
    changePost: {
      type: ProfileType,
      args: {
        id: requiredId,
        dto: requiredDto(ChangePostType),
      },
      resolve: async (_, { id, dto }: ChangePost) =>
        await prisma.post.update({
          where: { id },
          data: dto,
        }),
    },

    subscribeTo: {
      type: UserType,
      args: {
        userId: requiredId,
        authorId: requiredId,
      },
      resolve: async (_, { userId, authorId }: { userId: string; authorId: string }) => {
        return await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            userSubscribedTo: {
              create: {
                authorId: authorId,
              },
            },
          },
        });
      },
    },

    unsubscribeFrom: {
      type: GraphQLBoolean,
      args: {
        userId: requiredId,
        authorId: requiredId,
      },
      resolve: async (_, { userId, authorId }: { userId: string; authorId: string }) => {
        await prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId: authorId,
            },
          },
        });
        return true;
      },
    },
  }),
});
