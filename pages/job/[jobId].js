// pages/job/[jobId].js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import NavBar from '@/components/NavBar';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';
import { Briefcase, MapPin, DollarSign, Calendar, Building2, User, Mail, Phone } from 'lucide-react';

export default function JobDetailsPage() {
  const router = useRouter();
  const { jobId } = router.query; // Get the job ID from the URL (e.g., /job/65c8a1b2c3d4e5f6a7b8c9d0)
  const { user } = useUser();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState(null);

  useEffect(() => {
    // Only fetch if router.query.jobId is available
    if (!jobId) return;

    async function fetchJobDetails() {
      try {
        setLoading(true);
        setError(null); // Clear previous errors

        const res = await fetch(`/api/jobs/${jobId}`); // <-- This calls your API route
        const data = await res.json();

        if (res.ok) {
          setJob(data.data);
        } else {
          setError(data.message || 'Failed to fetch job details.');
          console.error('API Error:', data.message);
        }
      } catch (err) {
        console.error('Client-side error fetching job details:', err);
        setError('An error occurred while connecting to the server.');
      } finally {
        setLoading(false);
      }
    }

    fetchJobDetails();
  }, [jobId]); // Dependency array: re-run effect if jobId changes

  const handleApply = async () => {
    if (!user) {
      alert("Please log in to apply for this job.");
      router.push('/AuthForm?mode=login'); // Redirect to your login page
      return;
    }
    if (user.role !== 'job-seeker') {
      alert("Only job seekers can apply for jobs.");
      return;
    }

    setApplyLoading(true);
    setApplySuccess(false);
    setApplyError(null);

    try {
      const res = await fetch('/api/jobs/apply', { // Your API endpoint for applying
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: job._id,
          jobSeekerId: user._id, // Pass the logged-in user's ID
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setApplySuccess(true);
        alert(data.message || "Application submitted successfully!");
      } else {
        setApplyError(data.message || "Failed to submit application.");
      }
    } catch (err) {
      console.error("Error submitting application:", err);
      setApplyError("An error occurred during application submission.");
    } finally {
      setApplyLoading(false);
    }
  };

  // --- Loading, Error, and Not Found States ---
  if (loading) {
    return (
      <>
        <NavBar />
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading job details...</span>
          </div>
          <p className="mt-3 text-muted">Loading job details...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBar />
        <div className="container py-5 text-center">
          <div className="alert alert-danger" role="alert">{error}</div>
          <Link href="/find-jobs" className="btn btn-primary mt-3">Back to Job Listings</Link>
        </div>
      </>
    );
  }

  if (!job) { // This handles cases where job is null after loading, e.g., if ID is invalid or not found by API
    return (
      <>
        <NavBar />
        <div className="container py-5 text-center">
          <div className="alert alert-info" role="alert">Job not found.</div>
          <Link href="/find-jobs" className="btn btn-primary mt-3">Back to Job Listings</Link>
        </div>
      </>
    );
  }

  // --- Main Job Details Display ---
  return (
    <>
      <Head>
        <title>{job.title} | Empower Her</title>
        <link rel="icon" href="/images/mainlogo1.png" type="image/png" />
      </Head>

      <NavBar />
      <div className="container py-5">
        <div className="card shadow-lg border-0 rounded-4 p-4 mb-4">
          <div className="card-body">
            <h1 className="card-title fw-bold text-primary mb-3">{job.title}</h1>
            <h5 className="card-subtitle mb-4 text-muted">
              Posted by: <span className="fw-semibold">{job.providerName || 'N/A'}</span>
            </h5>

            <p className="card-text mb-4" style={{ whiteSpace: 'pre-wrap' }}>{job.description}</p>

            <div className="row mb-4">
              <div className="col-md-6 mb-3">
                <h6 className="fw-semibold text-secondary d-flex align-items-center mb-2">
                  <MapPin size={20} className="me-2 text-info" />Location
                </h6>
                <p className="text-muted">{job.location}, {job.city}</p>
              </div>
              <div className="col-md-6 mb-3">
                <h6 className="fw-semibold text-secondary d-flex align-items-center mb-2">
                  <DollarSign size={20} className="me-2 text-success" />Salary
                </h6>
                <p className="text-muted">{job.salary}</p>
              </div>
              <div className="col-md-6 mb-3">
                <h6 className="fw-semibold text-secondary d-flex align-items-center mb-2">
                  <Calendar size={20} className="me-2 text-warning" />Application Deadline
                </h6>
                <p className="text-muted">{new Date(job.deadline).toLocaleDateString('en-GB')}</p>
              </div>
              <div className="col-md-6 mb-3">
                <h6 className="fw-semibold text-secondary d-flex align-items-center mb-2">
                  <Briefcase size={20} className="me-2 text-primary" />Posted On
                </h6>
                <p className="text-muted">{new Date(job.createdAt).toLocaleDateString('en-GB')}</p>
              </div>
            </div>

            {/* Apply Button Section - Conditional Rendering based on user role/login */}
            {user && user.role === 'job-seeker' && ( // Only show if user is logged in and is a job seeker
              <div className="d-flex justify-content-center mt-4">
                <button
                  onClick={handleApply}
                  className="btn btn-primary btn-lg rounded-pill px-5 py-3"
                  disabled={applyLoading || applySuccess} // Disable if applying or already applied successfully
                >
                  {applyLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Applying...
                    </>
                  ) : applySuccess ? (
                    'Applied!'
                  ) : (
                    'Apply Now'
                  )}
                </button>
              </div>
            )}
            {!user && ( // Show login prompt if not logged in
                <div className="text-center mt-4">
                    <p className="text-muted">Please <Link href="/AuthForm?mode=login">log in</Link> to apply for this job.</p>
                </div>
            )}
            {user && user.role === 'job-provider' && ( // Message for job providers
                <div className="text-center mt-4">
                    <p className="text-muted">Job providers cannot apply for jobs.</p>
                </div>
            )}

            {applyError && ( // Display application error message
              <div className="alert alert-danger mt-3 text-center" role="alert">
                {applyError}
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-5">
          <Link href="/find-jobs" className="btn btn-outline-secondary px-4">Back to Job Listings</Link>
        </div>
      </div>
    </>
  );
}