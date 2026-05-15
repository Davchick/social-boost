import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || fallback;
}

export const api = {
  login: async (email, password) => {
    try {
      const response = await http.post("/auth/login", { email, password });
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Ошибка авторизации"));
    }
  },

  register: async (data) => {
    try {
      const response = await http.post("/auth/register", data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Ошибка регистрации"));
    }
  },

  submitContactForm: async (data) => {
    try {
      const response = await http.post("/contact", data);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Ошибка отправки заявки"));
    }
  },

  getOrders: async () => {
    const response = await http.get("/orders");
    return response.data.orders;
  },

  getOrderById: async (id) => {
    const response = await http.get(`/orders/${id}`);
    return response.data.order;
  },

  createOrder: async (data) => {
    const payload = {
      service: data.service?.title || data.service,
      region: data.region,
      budget: data.budget,
      timeline: data.timeline,
      description: data.description,
      wishes: data.wishes,
    };
    const response = await http.post("/orders", payload);
    return response.data;
  },

  cancelOrder: async (id) => {
    const response = await http.patch(`/orders/${id}/cancel`);
    return response.data.order;
  },

  updateOrderStatus: async (id, status) => {
    const response = await http.patch(`/orders/${id}/status`, { status });
    return response.data.order;
  },

  deleteOrder: async (id) => {
    const response = await http.delete(`/orders/${id}`);
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await http.patch("/users/me", data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await http.patch("/users/me/password", data);
    return response.data;
  },

  getAdminUsers: async () => {
    const response = await http.get("/admin/users");
    return response.data.users;
  },

  getContactRequests: async () => {
    const response = await http.get("/admin/contact-requests");
    return response.data.contactRequests;
  },

  updateContactRequestStatus: async (id, status) => {
    const response = await http.patch(`/admin/contact-requests/${id}`, {
      status,
    });
    return response.data.contactRequest;
  },
};
