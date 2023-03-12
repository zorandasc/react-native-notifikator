import client from "./client";

const endPoint = "/expoPushTokens";

const register = (pushToken) => client.post(endPoint, { token: pushToken });

export default {
  register,
};
