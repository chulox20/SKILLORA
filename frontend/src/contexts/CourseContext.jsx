import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { courseService } from '../services/courseService';

const CourseContext = createContext(null);

export function CourseProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    level: 'all',
    duration: 'all',
    sortBy: 'popular',
    search: '',
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [fetchedCourses, fetchedCategories] = await Promise.all([
        courseService.getCourses(filters),
        courseService.getCategories(),
      ]);
      setCourses(fetchedCourses);
      setCategories(fetchedCategories);
    } catch (err) {
      console.error('Error fetching course data:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      level: 'all',
      duration: 'all',
      sortBy: 'popular',
      search: '',
    });
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        categories,
        loading,
        filters,
        setFilters,
        updateFilter,
        resetFilters,
        refreshCourses: loadData,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export function useCourses() {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
}
