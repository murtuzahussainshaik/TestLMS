// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { courseService } from "../services/courseService";
import Loader from "../components/common/Loader";
import CourseCard from "../components/courses/CourseCard";
import {
  AcademicCapIcon,
  LightBulbIcon,
  UserGroupIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);

  // Fetch published courses
  const { data, isLoading } = useQuery({
    queryKey: ["featured-courses"],
    queryFn: () => courseService.getPublishedCourses(1, 6),
    refetchOnWindowFocus: false
  });

  // Set featured courses when data is loaded
  useEffect(() => {
    if (data && !isLoading) {
      setFeaturedCourses(data.data || []);
    }
  }, [data, isLoading]);

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      content:
        "This platform transformed my learning experience. The courses are well-structured and the instructors are top-notch. I was able to master web development in just a few months!",
      author: "Priya Sharma",
      role: "Web Developer",
      avatar: "https://randomuser.me/api/portraits/women/79.jpg",
      rating: 5,
    },
    {
      id: 2,
      content:
        "The quality of content is exceptional. I've tried many online learning platforms, but this one stands out with its practical approach and industry-relevant curriculum.",
      author: "Rahul Mehta",
      role: "Data Scientist",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
    },
    {
      id: 3,
      content:
        "The interactive lectures and hands-on projects helped me build a strong portfolio. I landed my dream job within weeks of completing the UX Design course!",
      author: "Ananya Patel",
      role: "UX Designer",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4,
    },
  ];

  // Features data
  const features = [
    {
      icon: <AcademicCapIcon className="h-8 w-8 text-primary-600" />,
      title: "Expert Instructors",
      description:
        "Learn from industry experts and professionals with years of experience in their respective fields.",
    },
    {
      icon: <LightBulbIcon className="h-8 w-8 text-primary-600" />,
      title: "Practical Learning",
      description:
        "Gain hands-on experience with real-world projects and case studies designed by industry professionals.",
    },
    {
      icon: <UserGroupIcon className="h-8 w-8 text-primary-600" />,
      title: "Community Support",
      description:
        "Connect with fellow learners, participate in discussions, and grow your professional network.",
    },
    {
      icon: <CurrencyRupeeIcon className="h-8 w-8 text-primary-600" />,
      title: "Affordable Pricing",
      description:
        "High-quality education at competitive prices with flexible payment options and occasional discounts.",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Unlock Your Learning Potential with Our Online Courses
              </h1>
              <p className="mt-4 text-lg md:text-xl text-white/80">
                Enhance your skills with high-quality courses taught by industry
                experts. Learn at your own pace and achieve your goals.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/courses"
                  className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-primary-800 bg-white hover:bg-primary-50"
                >
                  Explore Courses
                </Link>
                <Link
                  to="/register"
                  className="inline-flex justify-center items-center px-6 py-3 border border-white rounded-md text-base font-medium text-white hover:bg-white/10"
                >
                  Sign Up Free
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="/api/placeholder/600/400"
                alt="Students learning online"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white dark:bg-secondary-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-4xl font-bold text-primary-600">100+</p>
              <p className="mt-2 text-lg text-secondary-500 dark:text-secondary-400">Courses</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary-600">50+</p>
              <p className="mt-2 text-lg text-secondary-500 dark:text-secondary-400">
                Expert Instructors
              </p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary-600">10,000+</p>
              <p className="mt-2 text-lg text-secondary-500 dark:text-secondary-400">Students</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary-600">95%</p>
              <p className="mt-2 text-lg text-secondary-500 dark:text-secondary-400">
                Satisfaction Rate
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-secondary-50 dark:bg-secondary-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              Why Choose Us
            </h2>
            <p className="mt-4 text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
              Our platform offers a unique learning experience designed to help
              you succeed
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 dark:bg-primary-900 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 dark:text-secondary-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Courses Section */}
      <div className="bg-white dark:bg-secondary-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              Featured Courses
            </h2>
            <p className="mt-4 text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
              Explore our most popular courses hand-picked by our team
            </p>
          </div>

          {isLoading ? (
            <Loader />
          ) : featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-secondary-500 dark:text-secondary-400">
                No courses available at the moment.
              </p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              to="/courses"
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              View All Courses
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-secondary-50 dark:bg-secondary-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              What Our Students Say
            </h2>
            <p className="mt-4 text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
              Don't just take our word for it. Hear what our students have to
              say about their learning journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating
                          ? "text-yellow-400"
                          : "text-secondary-300 dark:text-secondary-600"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-secondary-600 dark:text-secondary-400 mb-6">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={testimonial.avatar}
                    alt={testimonial.author}
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                      {testimonial.author}
                    </p>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/3 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold">
                Ready to start your learning journey?
              </h2>
              <p className="mt-4 text-lg text-white/80">
                Join thousands of students who are already learning and growing
                with us.
              </p>
            </div>
            <div>
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-primary-800 bg-white hover:bg-primary-50"
              >
                Get Started Today
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
