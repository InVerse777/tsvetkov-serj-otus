import User from "../models/User.js";

export const createUser = async function (userJson) {
  return await User.create(userJson);
};

export const getUser = async function (query) {
  return await User.findOne(query);
};
