import axiosClient from "./axios";

const chatApi = {
  userChats: async (id) => {
    const url = `/chat/${id}`;
    return axiosClient.get(url);
  },
  getConversation: async (id) => {
    const url = `/nhantin/getConverstation/${id}`;
    return axiosClient.get(url);
  },
  getUser: async () => {
    const url = `/auth/getUser`;
    return axiosClient.get(url);
  },
  getUserById: async (id) => {
    const url = `/auth/getUserById/${id}`;
    return axiosClient.get(url);
  },
  getMessages: async (id) => {
    const url = `/nhantin/getMessages/${id}`;
    return axiosClient.get(url);
  },
  createMessage: async (data) => {
    const url = `/nhantin/createMessage`;
    return axiosClient.post(url, data);
  },
  addMessage: async (data) => {
    const url = `/nhantin/message`;
    return axiosClient.post(url, data);
  },
  getFriendList: async (data) => {
    const url = "/auth/getAllFriend";
    return axiosClient.get(url);
  },
  getUserByUserName: async (data) => {
    console.log("DSRESSESRSRER", data);
    const url = `/auth/findbyemail/${data}`;
    return axiosClient.get(url);
  },
};

export default chatApi;
