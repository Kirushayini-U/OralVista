import api from "../api/axios.js";

export const getPublishedNewsletters = async () => {
  const response = await api.get("/newsletters/published");
  return response.data;
};

export const getNewsletterSubscription = async () => {
  const response = await api.get("/newsletters/subscription");
  return response.data;
};

export const updateNewsletterSubscription = async (subscribed) => {
  const response = await api.patch("/newsletters/subscription", { subscribed });
  return response.data;
};

export const getAdminNewsletters = async (params = {}) => {
  const response = await api.get("/newsletters/admin", { params });
  return response.data;
};

export const getAdminNewsletter = async (id) => {
  const response = await api.get(`/newsletters/admin/${id}`);
  return response.data;
};

export const createNewsletter = async (payload) => {
  const response = await api.post("/newsletters/admin", payload);
  return response.data;
};

export const updateNewsletter = async (id, payload) => {
  const response = await api.patch(`/newsletters/admin/${id}`, payload);
  return response.data;
};

export const publishNewsletter = async (id) => {
  const response = await api.patch(`/newsletters/admin/${id}/publish`);
  return response.data;
};

export const sendNewsletter = async (id) => {
  const response = await api.post(`/newsletters/admin/${id}/send`);
  return response.data;
};


export const deleteNewsletter = async (id) => {
  if (!id) {
    throw new Error("Newsletter ID is required.");
  }

  const response = await api.delete(
    `/newsletters/admin/${id}`
  );

  return response.data;
};
