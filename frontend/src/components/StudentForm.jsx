import React, { useState } from 'react';
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

export default function StudentForm({ onStudentAdded }) {
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    courseId: ''
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!formData.studentId || !formData.name || !formData.email || !formData.courseId) {
      setStatus({ type: 'error', message: 'Please fill in all student fields.' });
      return;
    }

    try {
      setLoading(true);
      await onStudentAdded(formData);
      setStatus({ type: 'success', message: `Student '${formData.name}' (${formData.studentId}) registered successfully!` });
      setFormData({ studentId: '', name: '', email: '', courseId: '' });
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to connect to Student Microservice (Port 5001)';
      setStatus({ type: 'error', message: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <UserPlus color="#818cf8" size={22} />
        <h3 style={{ fontSize: '1.2rem' }}>Add New Student</h3>
      </div>

      {status.message && (
        <div className={`alert ${status.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {status.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{status.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="studentId">Student ID</label>
          <input
            type="text"
            id="studentId"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            placeholder="e.g. S001"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Nandana"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. nandana@gmail.com"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="courseId">Enrolled Course ID</label>
          <input
            type="text"
            id="courseId"
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            placeholder="e.g. C001"
            className="form-control"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '0.5rem' }}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Add Student'}
        </button>
      </form>
    </div>
  );
}
