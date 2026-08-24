import {
  INITIAL_CATEGORIES,
  INITIAL_COURSES,
  INITIAL_QUIZZES,
  DEMO_USERS,
  INITIAL_ENROLLMENTS,
  INITIAL_PROGRESS,
  INITIAL_CERTIFICATES,
} from '../lib/initialData';

const STORAGE_KEYS = {
  CATEGORIES: 'skillora_categories',
  COURSES: 'skillora_courses',
  QUIZZES: 'skillora_quizzes',
  USERS: 'skillora_users',
  CURRENT_USER: 'skillora_current_user',
  ENROLLMENTS: 'skillora_enrollments',
  PROGRESS: 'skillora_progress',
  QUIZ_ATTEMPTS: 'skillora_quiz_attempts',
  CERTIFICATES: 'skillora_certificates',
};

// Initialize localStorage with initial data if not present
export function initLocalStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.QUIZZES)) {
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(INITIAL_QUIZZES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([DEMO_USERS.student, DEMO_USERS.admin]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEMO_USERS.student));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ENROLLMENTS)) {
    localStorage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify(INITIAL_ENROLLMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROGRESS)) {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(INITIAL_PROGRESS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.QUIZ_ATTEMPTS)) {
    localStorage.setItem(STORAGE_KEYS.QUIZ_ATTEMPTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CERTIFICATES)) {
    localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(INITIAL_CERTIFICATES));
  }
}

// Generic get and set
export function getLocalItem(key, fallback = []) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return fallback;
  }
}

export function setLocalItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

export { STORAGE_KEYS };
