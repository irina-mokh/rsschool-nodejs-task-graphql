import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { Post } from '@prisma/client';

const postFields = {
  title: { type: GraphQLString },
  content: { type: GraphQLString },
  authorId: { type: UUIDType },
}

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: UUIDType },
    ...postFields
  }),
});

export type CreatePost = {
  dto: Omit<Post, 'id'>
}

export interface ChangePost extends CreatePost {
  id: string,
}

export const CreatePostType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  }),
});

export const ChangePostType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    id: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  }),
});
