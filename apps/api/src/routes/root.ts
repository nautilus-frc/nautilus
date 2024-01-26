import { Context } from "elysia";
import { User } from "../models/usersDB/UserModel";
import json, { message } from "../util/json";

export async function getRoot( {set} : Context) {
  set.headers["Content-Type"] = "application/json";
  try {
    const users = await User.find({});
  if(!users) {
    set.status = 404;
    return message("No users found");
  }
  set.status = 200;
  return json(users);
  }catch {
    set.status = 500;
    return message("Internal server error");
  }
}