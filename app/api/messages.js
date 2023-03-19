import client from "./client";

const endPoint = "/messages";

const getMessages = () => client.get(endPoint);

const touchMessage = (id) => client.patch(endPoint + "/" + id);

const deleteMessage = (id) => client.delete(endPoint + "/" + id);

export default {
  getMessages,
  deleteMessage,
  touchMessage
};
