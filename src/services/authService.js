import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getLocalItem, setLocalItem, STORAGE_KEYS } from './storageHelper';
import { DEMO_USERS } from '../lib/initialData';

export const authService = {
  // Get current user and profile
  async getCurrentUser() {
    if (isSupabaseConfigured) {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) return null;

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError || !profile) {
          return {
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            avatar_url: session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            role: 'student',
          };
        }

        return profile;
      } catch (err) {
        console.error('Error fetching Supabase user:', err);
      }
    }

    // Fallback: LocalStorage user
    const currentUser = getLocalItem(STORAGE_KEYS.CURRENT_USER, null);
    return currentUser || DEMO_USERS.student;
  },

  // Sign in with Email + Password
  async signIn({ email, password }) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return this.getCurrentUser();
    }

    // Fallback
    const users = getLocalItem(STORAGE_KEYS.USERS, [DEMO_USERS.student, DEMO_USERS.admin]);
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (foundUser) {
      setLocalItem(STORAGE_KEYS.CURRENT_USER, foundUser);
      return foundUser;
    }

    // If not found, create as new student
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      full_name: email.split('@')[0],
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'student',
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    setLocalItem(STORAGE_KEYS.USERS, users);
    setLocalItem(STORAGE_KEYS.CURRENT_USER, newUser);
    return newUser;
  },

  // Sign up with Email + Password (always student role)
  async signUp({ email, password, full_name }) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            role: 'student', // Never allow admin from signup
          },
        },
      });
      if (error) throw error;
      return this.getCurrentUser();
    }

    // Fallback
    const users = getLocalItem(STORAGE_KEYS.USERS, [DEMO_USERS.student, DEMO_USERS.admin]);
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('Ya existe una cuenta con este correo electrónico.');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email,
      full_name: full_name || email.split('@')[0],
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'student', // Default role
      created_at: new Date().toISOString(),
    };

    users.push(newUser);
    setLocalItem(STORAGE_KEYS.USERS, users);
    setLocalItem(STORAGE_KEYS.CURRENT_USER, newUser);
    return newUser;
  },

  // Google OAuth
  async signInWithGoogle() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard',
        },
      });
      if (error) throw error;
      return data;
    }

    // Fallback for demo
    const demoStudent = DEMO_USERS.student;
    setLocalItem(STORAGE_KEYS.CURRENT_USER, demoStudent);
    return demoStudent;
  },

  // Sign out
  async signOut() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setLocalItem(STORAGE_KEYS.CURRENT_USER, null);
  },

  // Update Profile
  async updateProfile(userId, updates) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    // Fallback
    const users = getLocalItem(STORAGE_KEYS.USERS, []);
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      setLocalItem(STORAGE_KEYS.USERS, users);
      setLocalItem(STORAGE_KEYS.CURRENT_USER, users[userIndex]);
      return users[userIndex];
    }
    return null;
  },

  // Demo Switcher (Instant demo login for testing)
  setDemoUser(role = 'student') {
    const user = role === 'admin' ? DEMO_USERS.admin : DEMO_USERS.student;
    setLocalItem(STORAGE_KEYS.CURRENT_USER, user);
    return user;
  },
};
