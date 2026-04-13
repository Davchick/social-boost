// Placeholder API functions
// Replace with real API calls when backend is ready

export const api = {
  // Auth
  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (email && password) {
      return {
        success: true,
        user: {
          id: '1',
          name: 'Иван Иванов',
          email: email,
          phone: '+7 (999) 123-45-67',
        },
        token: 'mock-jwt-token',
      }
    }
    throw new Error('Invalid credentials')
  },

  register: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      success: true,
      user: {
        id: '1',
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
      token: 'mock-jwt-token',
    }
  },

  // Contact form
  submitContactForm: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { success: true, message: 'Заявка отправлена!' }
  },

  // Orders
  getOrders: async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return [
      {
        id: '001',
        service: 'Контекстная реклама',
        status: 'in-progress',
        createdAt: '2024-01-15',
        budget: '50 000 ₽',
      },
      {
        id: '002',
        service: 'SEO-продвижение',
        status: 'completed',
        createdAt: '2024-01-10',
        budget: '35 000 ₽',
      },
      {
        id: '003',
        service: 'SMM',
        status: 'new',
        createdAt: '2024-01-20',
        budget: '25 000 ₽',
      },
    ]
  },

  getOrderById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      id,
      service: 'Контекстная реклама',
      status: 'in-progress',
      createdAt: '2024-01-15',
      budget: '50 000 ₽',
      description: 'Настройка и ведение контекстной рекламы в Яндекс.Директ',
      website: 'example.com',
      region: 'Москва и МО',
      timeline: [
        { stage: 'Создан', date: '15.01.2024', completed: true },
        { stage: 'Принят', date: '16.01.2024', completed: true },
        { stage: 'В работе', date: '17.01.2024', completed: true },
        { stage: 'Завершён', date: null, completed: false },
      ],
    }
  },

  createOrder: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      success: true,
      orderId: Math.random().toString(36).substring(7).toUpperCase(),
    }
  },

  // Profile
  updateProfile: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { success: true, user: data }
  },

  changePassword: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { success: true }
  },
}
