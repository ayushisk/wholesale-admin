const API_BASE_URL = "http://localhost:5000/api/v1"

class AdminApiClient {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // Use cookies instead of Authorization header
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.msg || "Something went wrong")
      }

      return data
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  // Use admin-specific auth routes
  async login(credentials) {
    return this.request("/admin-auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async logout() {
    return this.request("/admin-auth/logout", {
      method: "POST",
    })
  }

  async checkAuth() {
    return this.request("/admin-auth/me")
  }

  // Category methods
  async getCategories() {
    return this.request("/category")
  }

  async getCategoryTree() {
    return this.request("/category/tree")
  }

  async getParentCategories() {
    return this.request("/category/parent-categories")
  }

  async createCategory(categoryData) {
    return this.request("/category", {
      method: "POST",
      body: JSON.stringify(categoryData),
    })
  }

  async updateCategory(id, categoryData) {
    return this.request(`/category/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    })
  }

  async deleteCategory(id) {
    return this.request(`/category/${id}`, {
      method: "DELETE",
    })
  }

  // Product methods
  async getProducts() {
    return this.request("/products")
  }

  async createProduct(productData) {
    return this.request("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    })
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    })
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: "DELETE",
    })
  }

  // Order methods
  async getOrders() {
    return this.request("/order")
  }

  async updateOrderStatus(id, status) {
    return this.request(`/order/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    })
  }

  async deleteOrder(id) {
    return this.request(`/order/${id}`, {
      method: "DELETE",
    })
  }

  // User methods
  async getUsers() {
    return this.request("/users")
  }

  async updateUserStatus(id, status) {
    return this.request(`/users/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    })
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: "DELETE",
    })
  };
}

export const adminApiClient = new AdminApiClient()
