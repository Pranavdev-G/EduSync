import React, { useState, useEffect } from 'react';
import { getStudentDetails, getStudents } from '../services/api';
import { Search, Layers, User, BookOpen, AlertCircle, ArrowRight, Server } from 'lucide-react';

export default function StudentCourseDetails({ initialStudentId }) {
  const [studentIdInput, setStudentIdInput] = useState(initialStudentId || '');
  const [studentsList, setStudentsList] = useState([]);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch available students list for quick selector
    fetchStudentList();
  }, []);

  useEffect(() => {
    if (initialStudentId) {
      setStudentIdInput(initialStudentId);
      handleFetchDetails(initialStudentId);
    }
  }, [initialStudentId]);

  const fetchStudentList = async () => {
    try {
      const res = await getStudents();
      setStudentsList(res.data.data || []);
    } catch (err) {
      console.error('Failed to load students list selector', err);
    }
  };

  const handleFetchDetails = async (idToFetch) => {
    const targetId = idToFetch || studentIdInput;
    if (!targetId) {
      setError('Please enter or select a Student ID.');
      return;
    }

    setLoading(true);
    setError(null);
    setDetails(null);

    try {
      // Calls GET http://localhost:5001/api/students/:studentId/details
      const res = await getStudentDetails(targetId);
      setDetails(res.data);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Error executing inter-service HTTP request.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Search Banner */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Layers color="#ec4899" size={24} />
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>Inter-Service Communication Details</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Calls <code style={{ color: '#818cf8', background: 'rgba(99,102,241,0.1)', padding: '2px 6px', borderRadius: '4px' }}>GET /api/students/:studentId/details</code> on Student Service, which fetches course info from Course Service over HTTP.
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleFetchDetails();
          }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
        >
          <div style={{ flex: '1', minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Enter Student ID (e.g. S001)"
              value={studentIdInput}
              onChange={(e) => setStudentIdInput(e.target.value)}
              className="form-control"
            />
          </div>

          {/* Quick Selector Dropdown */}
          {studentsList.length > 0 && (
            <select
              value={studentIdInput}
              onChange={(e) => {
                setStudentIdInput(e.target.value);
                if (e.target.value) handleFetchDetails(e.target.value);
              }}
              className="form-control"
              style={{ width: 'auto', minWidth: '180px' }}
            >
              <option value="">-- Quick Select --</option>
              {studentsList.map((s) => (
                <option key={s.studentId} value={s.studentId}>
                  {s.studentId} - {s.name}
                </option>
              ))}
            </select>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Search size={16} />
            {loading ? 'Fetching...' : 'Get Details'}
          </button>
        </form>

        {error && (
          <div className="alert alert-error" style={{ marginTop: '1rem', marginBottom: 0 }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Visual Microservice Flow Architecture Indicator */}
      {details && (
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px dashed var(--border-color)', borderRadius: '12px', padding: '1rem 1.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
            ⚡ Inter-Service REST Call Flow Trace
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem', textAlign: 'center' }}>
            
            <div style={{ padding: '0.5rem 1rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#818cf8' }}>React Frontend</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Browser / Client</div>
            </div>

            <ArrowRight size={20} color="var(--primary)" />

            <div style={{ padding: '0.5rem 1rem', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#818cf8' }}>Student Microservice</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Port 5001 (MongoDB)</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ArrowRight size={20} color="#ec4899" />
              <span style={{ fontSize: '0.7rem', color: '#ec4899', fontWeight: 600 }}>HTTP GET</span>
            </div>

            <div style={{ padding: '0.5rem 1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399' }}>Course Microservice</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Port 5002 (MongoDB)</div>
            </div>

          </div>
        </div>
      )}

      {/* Results Display */}
      {details && details.student && details.course && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          {/* Student Card */}
          <div className="glass-card" style={{ borderLeft: '4px solid #6366f1' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User color="#818cf8" size={20} />
                <h4 style={{ fontSize: '1.1rem' }}>Student Profile</h4>
              </div>
              <span className="badge badge-indigo">Student DB</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Student ID</span>
                <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{details.student.studentId}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Student Name</span>
                <p style={{ fontSize: '1rem', fontWeight: 600 }}>{details.student.name}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email Address</span>
                <p style={{ fontSize: '0.95rem', color: '#818cf8' }}>{details.student.email}</p>
              </div>
            </div>
          </div>

          {/* Course Card */}
          <div className="glass-card" style={{ borderLeft: '4px solid #10b981' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen color="#34d399" size={20} />
                <h4 style={{ fontSize: '1.1rem' }}>Enrolled Course Info</h4>
              </div>
              <span className="badge badge-emerald">Course Service API</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Course ID</span>
                <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399' }}>{details.course.courseId}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Course Name</span>
                <p style={{ fontSize: '1rem', fontWeight: 600 }}>{details.course.courseName}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Academic Credits</span>
                <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#facc15' }}>{details.course.credits} Credits</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Raw Combined JSON Payload Preview */}
      {details && (
        <div className="glass-card">
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            📄 Combined Microservice Response Payload (JSON)
          </h4>
          <pre style={{ background: '#090d16', padding: '1rem', borderRadius: '8px', overflowX: 'auto', fontSize: '0.85rem', color: '#a7f3d0', border: '1px solid var(--border-color)' }}>
            {JSON.stringify(details, null, 2)}
          </pre>
        </div>
      )}

    </div>
  );
}
