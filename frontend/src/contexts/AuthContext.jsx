import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useNotification } from './NotificationContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useNotification();

  // Load user profile on startup using JWT
  useEffect(() => {
    async function loadInitialUser() {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Error loading initial user:', err);
      } finally {
        setLoading(false);
      }
    }

    loadInitialUser();
  }, []);

  // Login handler
  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await authService.signIn({ email, password });
      setUser(data.user);
      toast.success('¡Bienvenido!', `Has iniciado sesión como ${data.user.full_name || data.user.email}`);
      return data.user;
    } catch (err) {
      toast.error('Error de autenticación', err.message || 'Credenciales inválidas');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async ({ email, password, full_name }) => {
    setLoading(true);
    try {
      const data = await authService.signUp({ email, password, fullName: full_name });
      setUser(data.user);
      toast.success('¡Cuenta creada!', 'Tu registro se ha completado exitosamente.');
      return data.user;
    } catch (err) {
      toast.error('Error al registrarte', err.message || 'No se pudo crear la cuenta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    await authService.signOut();
    setUser(null);
    toast.info('Sesión cerrada', 'Has salido de Skillora.');
  };

  // Update Profile
  const updateProfile = async (updates) => {
    if (!user) return;
    try {
      const updated = await authService.updateProfile(updates);
      if (updated) {
        setUser(updated);
        toast.success('Perfil actualizado', 'Tus datos se han guardado correctamente.');
        return updated;
      }
    } catch (err) {
      toast.error('Error', 'No se pudo actualizar el perfil.');
      throw err;
    }
  };

  // Demo switch helper
  const switchDemo = async (role) => {
    setLoading(true);
    try {
      let data;
      if (role === 'admin') {
        data = await authService.loginAsDemoAdmin();
      } else {
        data = await authService.loginAsDemoStudent();
      }
      setUser(data.user);
      toast.success('Modo Demo Activado', `Ahora estás explorando como ${role === 'admin' ? 'Administrador' : 'Estudiante'}.`);
    } catch (err) {
      toast.error('Error al cambiar de usuario demo', err.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    role: user?.role || 'student',
    isAdmin: user?.role === 'admin',
    isStudent: user?.role === 'student',
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    updateProfile,
    switchDemo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
