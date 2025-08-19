import {  UserDocument } from "src/modules/user/user.schema";

export function userToResponse(user: UserDocument) {
  const { password, ...rest } = user.toObject();
  return rest;
}