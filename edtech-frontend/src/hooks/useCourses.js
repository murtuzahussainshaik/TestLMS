// src/hooks/useCourses.js
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "../services/courseService";
import { toast } from "react-hot-toast";

/**
 * Custom hook for course management
 * @returns {Object} Course management methods and state
 */
export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({
    query: "",
    categories: [],
    level: "",
    priceRange: "",
    sortBy: "newest",
  });

  // Get courses with applied filters
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["courses", filters],
    queryFn: () => courseService.searchCourses(filters),
    keepPreviousData: true,
    refetchOnWindowFocus: false
  });

  // Update courses when data changes
  useEffect(() => {
    if (data && !isLoading) {
      setCourses(data.data || []);
    }
  }, [data, isLoading]);

  // Show error toast if request fails
  useEffect(() => {
    if (error) {
      toast.error("Failed to load courses");
    }
  }, [error]);

  // Apply search filters
  const applyFilters = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      query: "",
      categories: [],
      level: "",
      priceRange: "",
      sortBy: "newest",
    });
  };

  return {
    courses,
    isLoading,
    error,
    filters,
    applyFilters,
    resetFilters,
    refetch,
  };
};
