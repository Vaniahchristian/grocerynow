const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api'

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  phone?: string
  address?: string
  city?: string
  postal_code?: string
  created_at: string
}

export interface AuthResponse {
  message: string
  user: User
  token: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
}

export interface LoginData {
  email: string
  password: string
}

// Auth API functions
export const authAPI = {
  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Registration failed')
    }

    return response.json()
  },

  // Login user
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Login failed')
    }

    return response.json()
  },

  // Get user profile
  getProfile: async (token: string): Promise<{ user: User }> => {
    const response = await fetch(`${API_BASE}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch profile')
    }

    return response.json()
  },

  // Update user profile
  updateProfile: async (token: string, data: Partial<RegisterData>): Promise<{ user: User }> => {
    const response = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update profile')
    }

    return response.json()
  },

  // Change password
  changePassword: async (token: string, currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to change password')
    }

    return response.json()
  }
}

// Token management utilities
export const tokenUtils = {
  setToken: (token: string) => {
    localStorage.setItem('auth_token', token)
  },

  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token')
    }
    return null
  },

  removeToken: () => {
    localStorage.removeItem('auth_token')
  },

  setUser: (user: User) => {
    localStorage.setItem('user_data', JSON.stringify(user))
  },

  getUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data')
      return userData ? JSON.parse(userData) : null
    }
    return null
  },

  removeUser: () => {
    localStorage.removeItem('user_data')
  },

  logout: () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
  }
}
