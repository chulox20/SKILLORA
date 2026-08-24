import { apiClient, tokenStorage } from './apiClient';

export const authService = {
  // Sign In with Email and Password (JWT)
  async signIn({ email, password }) {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      if (response.data?.token) {
        tokenStorage.set(response.data.token);
      }
      return response.data;
    } catch (err) {
      throw err;
    }
  },

  // Sign Up new student
  async signUp({ fullName, email, password }) {
    try {
      const response = await apiClient.post('/auth/register', { fullName, email, password });
      if (response.data?.token) {
        tokenStorage.set(response.data.token);
      }
      return response.data;
    } catch (err) {
      throw err;
    }
  },

  // Get current user profile with token
  async getCurrentUser() {
    const token = tokenStorage.get();
    if (!token) return null;

    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (err) {
      tokenStorage.remove();
      return null;
    }
  },

  // Sign Out
  async signOut() {
    tokenStorage.remove();
    return true;
  },

  // Update Profile
  async updateProfile(profileData) {
    const response = await apiClient.put('/auth/profile', profileData);
    return response.data;
  },

  // Forgot password
  async resetPasswordForEmail(email) {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response;
  },

  // Quick Demo Login helpers
  async loginAsDemoStudent() {
    return this.signIn({
      email: 'estudiante@skillora.edu',
      password: 'password123',
    });
  },

  async loginAsDemoAdmin() {
    return this.signIn({
      email: 'admin@skillora.edu',
      password: 'adminpassword',
    });
  },
};
