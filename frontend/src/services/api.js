import axios from 'axios';

const STUDENT_SERVICE_URL = import.meta.env.VITE_STUDENT_SERVICE_URL || 'http://localhost:5001';
const COURSE_SERVICE_URL = import.meta.env.VITE_COURSE_SERVICE_URL || 'http://localhost:5002';

// Student API Calls
export const getStudents = () => axios.get(`${STUDENT_SERVICE_URL}/api/students`);
export const createStudent = (studentData) => axios.post(`${STUDENT_SERVICE_URL}/api/students`, studentData);
export const getStudentById = (studentId) => axios.get(`${STUDENT_SERVICE_URL}/api/students/${studentId}`);
export const getStudentDetails = (studentId) => axios.get(`${STUDENT_SERVICE_URL}/api/students/${studentId}/details`);

// Course API Calls
export const getCourses = () => axios.get(`${COURSE_SERVICE_URL}/api/courses`);
export const createCourse = (courseData) => axios.post(`${COURSE_SERVICE_URL}/api/courses`, courseData);
export const getCourseById = (courseId) => axios.get(`${COURSE_SERVICE_URL}/api/courses/${courseId}`);
