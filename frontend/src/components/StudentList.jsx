import React from 'react';
import { Users, RefreshCw, Mail, BookMarked } from 'lucide-react';

export default function StudentList({ students, loading, error, onRefresh, onViewDetails }) {
  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users color="#818cf8" size={22} />
          <h3 style={{ fontSize: '1.2rem' }}>Registered Students ({students.length})</h3>
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
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Loading student records...</p>
      ) : students.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <Users size={48} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
          <p>No students found. Add a student using the form.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Course ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.studentId || student._id}>
                  <td>
                    <span className="badge badge-indigo">{student.studentId}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{student.name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Mail size={13} /> {student.email}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-emerald">
                      <BookMarked size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {student.courseId}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn"
                      onClick={() => onViewDetails(student.studentId)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        fontSize: '0.8rem',
                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
                        color: '#818cf8',
                        border: '1px solid rgba(99, 102, 241, 0.4)'
                      }}
                    >
                      View Details
                    </button>
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
