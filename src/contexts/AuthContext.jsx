import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { initLocalStorage } from '../services/storageHelper';
import { useNotification } from './NotificationContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useNotification();

  // Initialize storage and load user
  useEffect(() => {
    initLocalStorage();

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

    // Supabase auth listener if configured
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const profile = await authService.getCurrentUser();
          setUser(profile);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      });

      return () => {
        subscription?.unsubscribe();
      };
    }
  }, []);

  // Login handler
  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const loggedUser = await authService.signIn({ email, password });
      setUser(loggedUser);
      toast.success('¡Bienvenido!', `Has iniciado sesión como ${loggedUser.full_name || loggedUser.email}`);
      return loggedUser;
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
      const newUser = await authService.signUp({ email, password, full_name });
      setUser(newUser);
      toast.success('¡Cuenta creada!', 'Tu registro se ha completado exitosamente.');
      return newUser;
    } catch (err) {
      toast.error('Error al registrarte', err.message || 'No se pudo crear la cuenta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth
  const loginWithGoogle = async () => {
    try {
      const loggedUser = await authService.signInWithGoogle();
      if (loggedUser) {
        setUser(loggedUser);
        toast.success('¡Bienvenido!', 'Sesión iniciada con Google.');
      }
    } catch (err) {
      toast.error('Error', 'No se pudo iniciar sesión con Google');
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
      const updated = await authService.updateProfile(user.id, updates);
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
  const switchDemo = (role) => {
    const demoUser = authService.setDemoUser(role);
    setUser(demoUser);
    toast.success('Modo Demo Activado', `Ahora estás explorando como ${role === 'admin' ? 'Administrador' : 'Estudiante'}.`);
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
    loginWithGoogle,
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
