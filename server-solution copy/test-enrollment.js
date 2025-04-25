// test-enrollment.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/user.model.js';
import { Course } from './models/course.model.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// IDs for enrollment
const userId = '680b4cc8acaf7e53a30f8543'; // Test User
const courseId = '680a2ed0b559ec39dfe59156'; // Web Development

// Function to enroll test user in course
async function enrollTestUser() {
  try {
    // Verify user and course exist
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);
    
    if (!user) {
      console.error('User not found');
      return;
    }
    
    if (!course) {
      console.error('Course not found');
      return;
    }
    
    console.log('User:', user.name, user.email);
    console.log('Course:', course.title);
    
    // Add course to user's enrolledCourses
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $addToSet: { 
          enrolledCourses: { 
            course: courseId,
            enrolledAt: new Date()
          } 
        } 
      },
      { new: true }
    );
    
    // Add user to course's enrolledStudents
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { enrolledStudents: userId } },
      { new: true }
    );
    
    console.log('User enrolled in course successfully');
    console.log('Updated user enrolled courses count:', updatedUser.enrolledCourses.length);
    console.log('Updated course enrolled students count:', updatedCourse.enrolledStudents.length);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close MongoDB connection
    mongoose.connection.close();
  }
}

// Execute the function
enrollTestUser(); 