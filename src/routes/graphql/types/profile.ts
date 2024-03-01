import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberType, MemberTypeId } from './member.js';
import prisma from '../prisma.js';
import { Profile } from '@prisma/client';

const profileFields = {
  isMale: { type: GraphQLBoolean },
  yearOfBirth: { type: GraphQLInt },
  userId: { type: UUIDType },
  memberTypeId: { type: MemberTypeId },
}

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    ...profileFields,

    memberType: {
      type: MemberType,
      resolve: async ({memberTypeId}: Profile) =>
        await prisma.memberType.findUnique({
          where: { id: memberTypeId },
        }),
    },
  }),
});

export type CreateProfile = {
  dto: Omit<Profile, 'id'>
}

export interface ChangeProfile {
  id: string,
  dto: Omit<Profile, 'userId'>
}

export const CreateProfileType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeId) },
  }),
});

//without userId
export const ChangeProfileType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeId },
  }),
});