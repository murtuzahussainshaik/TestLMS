// src/pages/Dashboard/MyCourses.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "../../services/courseService";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import CourseCard from "../../components/courses/CourseCard";
import PageHeader from "../../components/common/PageHeader";
import { PlusIcon } from "@heroicons/react/24/outline";

const MyCourses = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-courses"],
    queryFn: () => courseService.getMyEnrolledCourses(),
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorState message={error.message} />;
  }

  const courses = data?.data || [];

  if (courses.length === 0) {
    return (
      <EmptyState
        title="No enrolled courses"
        description="You haven't enrolled in any courses yet. Browse our catalog to find courses that interest you."
        linkText="Browse Courses"
        linkTo="/courses"
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <PageHeader title="My Courses" />
        <Link
          to="/courses"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Explore More Courses
        </Link>
      </div>

      <div className="bg-white dark:bg-secondary-800 shadow overflow-hidden rounded-lg p-6">
        <h3 className="text-lg font-medium leading-6 text-secondary-900 dark:text-white mb-4">
          Continue Learning
        </h3>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map((course) => (
            <CourseCard 
              key={course._id} 
              course={course} 
              linkTo={`/dashboard/course/${course._id}`}
              buttonText="Continue Learning"
            />
          ))}
        </div>
        
        {courses.length > 8 && (
          <div className="mt-8 text-center">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 dark:text-primary-400 bg-primary-100 dark:bg-primary-900 hover:bg-primary-200 dark:hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
