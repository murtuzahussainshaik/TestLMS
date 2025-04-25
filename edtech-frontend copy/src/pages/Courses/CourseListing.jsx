// src/pages/Courses/CourseListing.jsx
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "../../services/courseService";
import CourseCard from "../../components/courses/CourseCard";
import CourseFilter from "../../components/courses/CourseFilter";
import Loader from "../../components/common/Loader";
import { toast } from "react-hot-toast";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const CourseListing = () => {
  const [searchParams, setSearchParams] = useState({
    query: "",
    categories: [],
    level: "",
    priceRange: "",
    sortBy: "newest",
  });

  const [debouncedParams, setDebouncedParams] = useState(searchParams);
  const [courses, setCourses] = useState([]);

  // Debounce search query to avoid too many requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedParams(searchParams);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchParams]);

  // Fetch courses based on search parameters
  const { data, isLoading, error } = useQuery({
    queryKey: ["courses", debouncedParams],
    queryFn: () => courseService.searchCourses(debouncedParams),
    keepPreviousData: true,
    refetchOnWindowFocus: false
  });

  // Update courses when data changes
  useEffect(() => {
    if (data && !isLoading) {
      console.log("Courses data loaded:", data);
      setCourses(data.data || []);
    }
  }, [data, isLoading]);

  // Handle filter changes
  const handleFilterChange = (filter) => {
    setSearchParams((prev) => ({
      ...prev,
      ...filter,
    }));
  };

  // Handle search input change
  const handleSearch = (e) => {
    setSearchParams((prev) => ({
      ...prev,
      query: e.target.value,
    }));
  };

  // Show error if courses couldn't be loaded
  useEffect(() => {
    if (error) {
      console.error("Error loading courses:", error);
      toast.error("Failed to load courses");
    }
  }, [error]);

  return (
    <div className="bg-secondary-50 dark:bg-secondary-950 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4 md:mb-0">
            Explore Courses
          </h1>

          {/* Search bar */}
          <div className="w-full md:w-1/3 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-secondary-400 dark:text-secondary-500" />
            </div>
            <input
              type="text"
              className="input pl-10"
              placeholder="Search courses..."
              value={searchParams.query}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters sidebar */}
          <div className="w-full md:w-1/4">
            <CourseFilter
              filters={searchParams}
              onChange={handleFilterChange}
            />
          </div>

          {/* Course grid */}
          <div className="w-full md:w-3/4">
            {isLoading ? (
              <Loader />
            ) : courses && courses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-8 text-center">
                <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
                  No courses found
                </h3>
                <p className="text-secondary-500 dark:text-secondary-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseListing;
