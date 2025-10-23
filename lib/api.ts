import axios, { type AxiosInstance } from "axios"

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api"

let axiosInstance: AxiosInstance

export const getAxiosInstance = (token?: string): AxiosInstance => {
  if (!axiosInstance) {
    axiosInstance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"]
  }

  return axiosInstance
}

// Auth APIs
export const authAPI = {
  login: async (email: string, password: string) => {
    const instance = getAxiosInstance()
    return instance.post("/auth/login", { email, password })
  },
  forgotPassword: async (email: string) => {
    const instance = getAxiosInstance()
    return instance.post("/auth/forget", { email })
  },
  resetPassword: async (email: string, otp: string, password: string) => {
    const instance = getAxiosInstance()
    return instance.post("/auth/reset-password", { email, otp, password })
  },
  changePassword: async (oldPassword: string, newPassword: string, token: string) => {
    const instance = getAxiosInstance(token)
    return instance.post("/user/change-password", { oldPassword, newPassword })
  },
}

// Dashboard APIs
export const dashboardAPI = {
  getOverview: async (token: string) => {
    const instance = getAxiosInstance(token)
    return instance.get("/user/admin-overview")
  },
}

// Category APIs
export const categoryAPI = {
  getCategories: async (token: string, page = 1, limit = 10) => {
    const instance = getAxiosInstance(token)
    return instance.get("/category", { params: { page, limit } })
  },
  createCategory: async (data: FormData, token: string) => {
    const instance = getAxiosInstance(token)
    return instance.post("/category", data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },
  updateCategory: async (id: string, data: FormData, token: string) => {
    const instance = getAxiosInstance(token)
    return instance.patch(`/category/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },
  deleteCategory: async (id: string, token: string) => {
    const instance = getAxiosInstance(token)
    return instance.delete(`/category/${id}`)
  },
}

// Order APIs
export const orderAPI = {
  getOrders: async (token: string, page = 1, limit = 10) => {
    const instance = getAxiosInstance(token)
    return instance.get("/order", { params: { page, limit } })
  },
}

// Revenue APIs
export const revenueAPI = {
  getRevenueFromSellers: async (token: string, page = 1, limit = 10) => {
    const instance = getAxiosInstance(token)
    return instance.get("/user/revenue-from-sellers", { params: { page, limit } })
  },
}

// Seller APIs
export const sellerAPI = {
  getSellers: async (token: string, page = 1, limit = 10) => {
    const instance = getAxiosInstance(token)
    return instance.get("/user/seller-profiles", { params: { page, limit } })
  },
  getSellerDetails: async (id: string, token: string) => {
    const instance = getAxiosInstance(token)
    return instance.get(`/user/seller-details/${id}`)
  },
  deleteSeller: async (id: string, token: string) => {
    const instance = getAxiosInstance(token)
    return instance.delete(`/user/seller-delete/${id}`)
  },
}

// Buyer APIs
export const buyerAPI = {
  getBuyers: async (token: string, page = 1, limit = 10) => {
    const instance = getAxiosInstance(token)
    return instance.get("/user/buyer-profiles", { params: { page, limit } })
  },
  getBuyerDetails: async (id: string, token: string) => {
    const instance = getAxiosInstance(token)
    return instance.get(`/user/buyer-details/${id}`)
  },
  deleteBuyer: async (id: string, token: string) => {
    const instance = getAxiosInstance(token)
    return instance.delete(`/user/buyer-delete/${id}`)
  },
}
