import React from 'react';
import { BookOpen, RefreshCw, Award } from 'lucide-react';

export default function CourseList({ courses, loading, error, onRefresh }) {
  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen color="#34d399" size={22} />
          <h3 style={{ fontSize: '1.2rem' }}>Available Courses ({courses.length})</h3>
        </div>
        <button className="btn" onClick={onRefresh} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)' }}>
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Loading courses records...</p>
      ) : courses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <BookOpen size={48} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
          <p>No courses found. Add a course using the form.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Course ID</th>
                <th>Course Name</th>
                <th>Credits</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.courseId || course._id}>
                  <td>
                    <span className="badge badge-emerald">{course.courseId}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{course.courseName}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#facc15' }}>
                      <Award size={14} /> {course.credits} Credits
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
