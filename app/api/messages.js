import client from "./client";

const endPoint = "/messages";

const getMessages = () => client.get(endPoint);

const deleteMessage = (id) => client.delete(endPoint + "/" + id);

export default {
  getMessages,
  deleteMessage
};
