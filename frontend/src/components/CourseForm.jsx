import React, { useState } from 'react';
import { BookPlus, AlertCircle, CheckCircle } from 'lucide-react';

export default function CourseForm({ onCourseAdded }) {
  const [formData, setFormData] = useState({
    courseId: '',
    courseName: '',
    credits: ''
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!formData.courseId || !formData.courseName || !formData.credits) {
      setStatus({ type: 'error', message: 'Please fill in all course fields.' });
      return;
    }

    try {
      setLoading(true);
      await onCourseAdded(formData);
      setStatus({ type: 'success', message: `Course '${formData.courseName}' (${formData.courseId}) created successfully!` });
      setFormData({ courseId: '', courseName: '', credits: '' });
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to connect to Course Microservice (Port 5002)';
      setStatus({ type: 'error', message: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <BookPlus color="#34d399" size={22} />
        <h3 style={{ fontSize: '1.2rem' }}>Add New Course</h3>
      </div>

      {status.message && (
        <div className={`alert ${status.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {status.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{status.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="courseId">Course ID</label>
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

        <div className="form-group">
          <label htmlFor="courseName">Course Name</label>
          <input
            type="text"
            id="courseName"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            placeholder="e.g. Full Stack Application Development"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="credits">Credits</label>
          <input
            type="number"
            id="credits"
            name="credits"
            min="1"
            max="10"
            value={formData.credits}
            onChange={handleChange}
            placeholder="e.g. 4"
            className="form-control"
          />
        </div>

        <button
          type="submit"
          className="btn btn-secondary"
          style={{ width: '100%', marginTop: '0.5rem' }}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Add Course'}
        </button>
      </form>
    </div>
  );
}
