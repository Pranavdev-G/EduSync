import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import CourseForm from './components/CourseForm';
import CourseList from './components/CourseList';
import StudentCourseDetails from './components/StudentCourseDetails';

import {
  getStudents,
  createStudent,
  getCourses,
  createCourse
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('students');
  const [selectedStudentId, setSelectedStudentId] = useState('');

  // Data States
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState(null);

  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState(null);

  // Fetch initial data
  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  // Fetch Students
  const fetchStudents = async () => {
    setStudentsLoading(true);
    setStudentsError(null);
    try {
      const res = await getStudents();
      setStudents(res.data.data || []);
    } catch (err) {
      setStudentsError('Unable to connect to Student Service at http://localhost:5001. Ensure service is started.');
    } finally {
      setStudentsLoading(false);
    }
  };

  // Fetch Courses
  const fetchCourses = async () => {
    setCoursesLoading(true);
    setCoursesError(null);
    try {
      const res = await getCourses();
      setCourses(res.data.data || []);
    } catch (err) {
      setCoursesError('Unable to connect to Course Service at http://localhost:5002. Ensure service is started.');
    } finally {
      setCoursesLoading(false);
    }
  };

  // Handlers
  const handleStudentAdded = async (formData) => {
    await createStudent(formData);
    await fetchStudents();
  };

  const handleCourseAdded = async (formData) => {
    await createCourse(formData);
    await fetchCourses();
  };

  const handleViewDetails = (studentId) => {
    setSelectedStudentId(studentId);
    setActiveTab('details');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="container" style={{ flex: 1 }}>
        {activeTab === 'students' && (
          <div className="grid-2">
            <StudentForm onStudentAdded={handleStudentAdded} />
            <StudentList
              students={students}
              loading={studentsLoading}
              error={studentsError}
              onRefresh={fetchStudents}
              onViewDetails={handleViewDetails}
            />
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="grid-2">
            <CourseForm onCourseAdded={handleCourseAdded} />
            <CourseList
              courses={courses}
              loading={coursesLoading}
              error={coursesError}
              onRefresh={fetchCourses}
            />
          </div>
        )}

        {activeTab === 'details' && (
          <StudentCourseDetails initialStudentId={selectedStudentId} />
        )}
      </main>

      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '1.5rem 0', marginTop: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <div className="container">
          <p>🎓 22MDC55 – Full Stack Application Development Laboratory | Exercise 13</p>
          <p style={{ marginTop: '0.25rem', opacity: 0.7 }}>Student Microservice (Port 5001) &bull; Course Microservice (Port 5002) &bull; React Frontend (Port 5173)</p>
        </div>
      </footer>
    </div>
  );
}
