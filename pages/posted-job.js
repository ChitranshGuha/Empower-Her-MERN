// pages/posted-job.js
import Head from 'next/head';
import NavBar from '@/components/NavBar';
import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';
import {
  Briefcase, MapPin, DollarSign, Calendar, Building2, User,
  Clock, CheckCircle, XCircle, Users, Eye, Edit, Trash, Mail, Phone
} from 'lucide-react';

export default function PostedJobsPage() {
  const { user } = useUser();
  const [postedJobs, setPostedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null); // Track which application is being updated

  const statusOptions = ['pending', 'reviewed', 'interview', 'rejected', 'hired'];

  // Function to fetch jobs posted by the current provider
  const fetchPostedJobs = useCallback(async () => {
    if (!user || user.role !== 'job-provider') {
      setLoading(false);
      return; // Handled by access denial below
    }

    try {
      setLoading(true);
      setError(null);
      // API route to get jobs posted by this user
      const jobsRes = await fetch(`/api/jobs/posted/${user._id}`);
      const jobsData = await jobsRes.json();

      if (jobsRes.ok && Array.isArray(jobsData.data)) {
        // For each job, fetch its applications
        const jobsWithApplications = await Promise.all(
          jobsData.data.map(async (job) => {
            const applicationsRes = await fetch(`/api/applications/job/${job._id}`);
            const applicationsData = await applicationsRes.json();

            if (applicationsRes.ok && Array.isArray(applicationsData.data)) {
              return { ...job, applicants: applicationsData.data };
            } else {
              console.error(`Failed to fetch applications for job ${job._id}:`, applicationsData.message || 'Unknown error');
              return { ...job, applicants: [] };
            }
          })
        );
        setPostedJobs(jobsWithApplications);
      } else {
        setError(jobsData.message || 'Failed to fetch posted jobs.');
      }
    } catch (err) {
      console.error('Client-side error fetching posted jobs:', err);
      setError('An error occurred while connecting to the server.');
    } finally {
      setLoading(false);
    }
  }, [user]); // Re-fetch if user changes

  useEffect(() => {
    fetchPostedJobs();
  }, [fetchPostedJobs]);

  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdatingStatus(applicationId); // Set loading state for this specific application

    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if you implement JWT tokens later
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        // Update the application status in the local state
        setPostedJobs(prevJobs =>
          prevJobs.map(job => ({
            ...job,
            applicants: job.applicants.map(applicant =>
              applicant._id === applicationId ? { ...applicant, status: data.application.status } : applicant
            ),
          }))
        );
        alert('Application status updated successfully!');
      } else {
        alert(data.message || 'Failed to update application status.');
      }
    } catch (err) {
      console.error('Error updating application status:', err);
      alert('An error occurred while updating status.');
    } finally {
      setUpdatingStatus(null); // Clear loading state
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'pending': return { text: 'text-warning', icon: <Clock size={16} className="me-1" /> };
      case 'reviewed': return { text: 'text-info', icon: <Briefcase size={16} className="me-1" /> };
      case 'interview': return { text: 'text-primary', icon: <User size={16} className="me-1" /> };
      case 'hired': return { text: 'text-success', icon: <CheckCircle size={16} className="me-1" /> };
      case 'rejected': return { text: 'text-danger', icon: <XCircle size={16} className="me-1" /> };
      default: return { text: 'text-muted', icon: <Clock size={16} className="me-1" /> };
    }
  };

  // Access control for job providers only
  if (!user || user.role !== 'job-provider') {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="bg-white p-5 rounded-4 shadow-lg text-center" style={{ maxWidth: "400px" }}>
          <div className="d-flex align-items-center justify-content-center mx-auto mb-4 rounded-circle bg-danger bg-opacity-10" style={{ width: "64px", height: "64px" }}>
            <Building2 className="text-danger" size={32} />
          </div>
          <h2 className="h3 fw-bold text-dark mb-3">Access Denied</h2>
          <p className="text-muted">Only job providers can view posted jobs and applications.</p>
          <p className="text-muted">Please log in or sign up with a job provider account.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Posted Jobs | Empower Her</title>
        <link rel="icon" href="/images/mainlogo1.png" type="image/png" />
      </Head>

      <NavBar />
      <div className="container py-5">
        <h1 className="text-center mb-5 fw-bold text-primary">Your Posted Jobs & Applicants</h1>

        {loading && (
          <div className="d-flex justify-content-center align-items-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading jobs and applications...</span>
            </div>
            <p className="ms-3 text-muted">Loading your jobs and their applicants...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        {!loading && postedJobs.length === 0 && !error && (
          <div className="alert alert-info text-center" role="alert">
            You haven't posted any jobs yet. <Link href="/post-job">Post a new job</Link> to get started!
          </div>
        )}

        <div className="accordion" id="postedJobsAccordion">
          {postedJobs.map((job, index) => (
            <div className="accordion-item mb-3 shadow-sm rounded-4 overflow-hidden" key={job._id}>
              <h2 className="accordion-header" id={`heading${job._id}`}>
                <button
                  className="accordion-button collapsed d-flex flex-column align-items-start py-4"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${job._id}`}
                  aria-expanded="false"
                  aria-controls={`collapse${job._id}`}
                >
                  <span className="fw-bold fs-5 text-primary mb-1">{job.title}</span>
                  <span className="text-muted small">
                    <MapPin size={14} className="me-1 text-info" />
                    {job.location}, {job.city} | <DollarSign size={14} className="me-1 text-success" /> {job.salary}
                  </span>
                  <span className="text-muted small mt-2">
                      <Users size={14} className="me-1 text-secondary" />
                      {job.applicants ? job.applicants.length : 0} Applicant(s)
                  </span>
                </button>
              </h2>
              <div
                id={`collapse${job._id}`}
                className="accordion-collapse collapse"
                aria-labelledby={`heading${job._id}`}
                data-bs-parent="#postedJobsAccordion"
              >
                <div className="accordion-body p-4">
                  <h6 className="fw-bold mb-3 text-secondary">Job Details:</h6>
                  <p className="text-muted small mb-3">{job.description}</p>
                  <ul className="list-unstyled small text-muted mb-4">
                    <li><Calendar size={14} className="me-1 text-warning" /> Deadline: {new Date(job.deadline).toLocaleDateString('en-GB')}</li>
                    <li><Clock size={14} className="me-1 text-secondary" /> Posted On: {new Date(job.createdAt).toLocaleDateString('en-GB')}</li>
                  </ul>
                  <div className="d-flex justify-content-end mb-4">
                      <Link href={`/job/${job._id}`} className="btn btn-outline-info btn-sm rounded-pill me-2">
                          <Eye size={16} className="me-1" /> View Job
                      </Link>
                      <Link href={`/post-job?edit=${job._id}`} className="btn btn-outline-secondary btn-sm rounded-pill"> {/* Link to an edit job page */}
                          <Edit size={16} className="me-1" /> Edit Job
                      </Link>
                      {/* Add Delete Job button here, with confirmation modal */}
                  </div>

                  <h6 className="fw-bold mb-3 text-secondary d-flex align-items-center">
                    <Users size={18} className="me-2 text-primary" /> Applicants:
                  </h6>
                  {job.applicants && job.applicants.length > 0 ? (
                    <ul className="list-group">
                      {job.applicants.map((applicant) => {
                        const status = getStatusDisplay(applicant.status);
                        return (
                          <li key={applicant._id} className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-2 rounded-3 shadow-sm py-3 px-4">
                            <div className="mb-2 mb-md-0">
                              <span className="fw-semibold text-dark">{applicant.jobSeeker.name}</span>
                              <p className="text-muted small mb-0">
                                <Mail size={14} className="me-1" /> {applicant.jobSeeker.email}
                                <span className="ms-3"><Phone size={14} className="me-1" /> {applicant.jobSeeker.phone}</span>
                              </p>
                              <p className="text-muted small mb-0">Applied: {new Date(applicant.appliedAt).toLocaleDateString('en-GB')}</p>
                            </div>
                            <div className="d-flex align-items-center">
                              <span className={`fw-bold text-capitalize d-flex align-items-center ${status.text} me-3`}>
                                {status.icon} {applicant.status}
                              </span>
                              <select
                                className="form-select form-select-sm"
                                value={applicant.status}
                                onChange={(e) => handleStatusChange(applicant._id, e.target.value)}
                                disabled={updatingStatus === applicant._id} // Disable during update
                                style={{ width: 'auto', minWidth: '120px' }}
                              >
                                {statusOptions.map(option => (
                                  <option key={option} value={option}>
                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                  </option>
                                ))}
                              </select>
                              {updatingStatus === applicant._id && (
                                <div className="spinner-border spinner-border-sm text-primary ms-2" role="status">
                                  <span className="visually-hidden">Updating...</span>
                                </div>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="alert alert-info text-center small" role="alert">
                      No applicants for this job yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}