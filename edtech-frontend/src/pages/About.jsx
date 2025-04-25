// src/pages/About.jsx
import { Link } from "react-router-dom";
import {
  AcademicCapIcon,
  BriefcaseIcon,
  UserGroupIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

const About = () => {
  // Team members data
  const teamMembers = [
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      bio: "With over 15 years of experience in education and technology, Rajesh founded EduTech with a vision to democratize quality education.",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      name: "Priya Sharma",
      role: "Chief Learning Officer",
      bio: "Priya brings her expertise in instructional design and curriculum development to ensure our courses meet the highest standards.",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      name: "Arjun Mehta",
      role: "CTO",
      bio: "A technology enthusiast with a passion for innovation, Arjun leads our tech team in building a seamless learning platform.",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
      name: "Neha Gupta",
      role: "Head of Student Success",
      bio: "Dedicated to enhancing the student experience, Neha ensures that every learner receives the support they need to succeed.",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    },
  ];

  // Values data
  const values = [
    {
      icon: <AcademicCapIcon className="h-8 w-8 text-primary-600" />,
      title: "Quality Education",
      description:
        "We are committed to delivering high-quality educational content that is relevant, up-to-date, and practical.",
    },
    {
      icon: <UserGroupIcon className="h-8 w-8 text-primary-600" />,
      title: "Student-Centered Approach",
      description:
        "Our students are at the heart of everything we do. We design our platform and courses with their needs in mind.",
    },
    {
      icon: <GlobeAltIcon className="h-8 w-8 text-primary-600" />,
      title: "Accessibility",
      description:
        "We believe that quality education should be accessible to everyone, regardless of their location or background.",
    },
    {
      icon: <BriefcaseIcon className="h-8 w-8 text-primary-600" />,
      title: "Industry Relevance",
      description:
        "Our courses are designed in collaboration with industry experts to ensure they meet current market demands.",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              About EduTech
            </h1>
            <p className="mt-4 text-xl text-white/80 max-w-3xl mx-auto">
              We're on a mission to make quality education accessible to
              everyone and empower individuals to achieve their full potential.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="bg-white dark:bg-secondary-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img
                src="/api/placeholder/600/400"
                alt="Our journey"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
                Our Story
              </h2>
              <div className="prose prose-lg text-secondary-600 dark:text-secondary-400 dark:prose-headings:text-secondary-200 prose-a:text-primary-600 dark:prose-a:text-primary-400">
                <p>
                  Founded in 2020, EduTech was born out of a simple yet powerful
                  vision: to bridge the gap between quality education and
                  accessibility. We noticed that while there was an abundance of
                  educational content available online, there was a lack of
                  structured, career-focused courses that could truly help
                  individuals transform their lives.
                </p>
                <p>
                  What started as a small team with a handful of courses has now
                  grown into a vibrant community of learners and educators.
                  Today, we offer a wide range of courses across various
                  domains, from technology and business to creative arts and
                  personal development.
                </p>
                <p>
                  Our journey has been guided by our unwavering commitment to
                  our students' success and our belief in the transformative
                  power of education. We continuously strive to innovate and
                  improve our platform to provide the best learning experience
                  possible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="bg-secondary-50 dark:bg-secondary-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              Our Values
            </h2>
            <p className="mt-4 text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
              Our values form the foundation of everything we do at EduTech
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 dark:bg-primary-900 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                  {value.title}
                </h3>
                <p className="text-secondary-600 dark:text-secondary-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white dark:bg-secondary-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              Meet Our Team
            </h2>
            <p className="mt-4 text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
              The passionate individuals behind EduTech who work tirelessly to
              make learning accessible and enjoyable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white dark:bg-secondary-800 rounded-lg shadow-sm overflow-hidden"
              >
                <img
                  className="w-full h-64 object-cover"
                  src={member.avatar}
                  alt={member.name}
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 dark:text-primary-500 mb-3">{member.role}</p>
                  <p className="text-secondary-600 dark:text-secondary-400 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Join Us Section */}
      <div className="bg-primary-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Join Our Learning Community</h2>
            <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
              Whether you're a student looking to learn new skills or an
              instructor with expertise to share, we welcome you to be a part of
              our growing community.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/courses"
                className="inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-primary-800 bg-white hover:bg-primary-50"
              >
                Explore Courses
              </Link>
              <Link
                to="/register?role=instructor"
                className="inline-flex justify-center items-center px-6 py-3 border border-white rounded-md text-base font-medium text-white hover:bg-white/10"
              >
                Become an Instructor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
