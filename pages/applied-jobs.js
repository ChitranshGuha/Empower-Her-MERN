import Head from 'next/head';
import NavBar from '@/components/NavBar';
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';
import { Briefcase, MapPin, DollarSign, Calendar, Building2, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function AppliedJobsPage() {
  const { user } = useUser();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAppliedJobs() {
      if (!user || user.role !== 'job-seeker') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/jobs/applied/${user._id}`);
        const data = await res.json();

        if (res.ok) {
          setApplications(data.data);
        } else {
          setError(data.message || 'Failed to fetch applied jobs.');
        }
      } catch (err) {
        setError('An error occurred while connecting to the server.');
      } finally {
        setLoading(false);
      }
    }

    fetchAppliedJobs();
  }, [user]);

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'pending':
        return { text: 'text-warning', icon: <Clock size={18} className="me-2" /> };
      case 'reviewed':
        return { text: 'text-info', icon: <Briefcase size={18} className="me-2" /> };
      case 'interview':
        return { text: 'text-primary', icon: <Briefcase size={18} className="me-2" /> };
      case 'hired':
        return { text: 'text-success', icon: <CheckCircle size={18} className="me-2" /> };
      case 'rejected':
        return { text: 'text-danger', icon: <XCircle size={18} className="me-2" /> };
      default:
        return { text: 'text-muted', icon: <Clock size={18} className="me-2" /> };
    }
  };

  if (!user || user.role !== 'job-seeker') {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="bg-white p-5 rounded-4 shadow-lg text-center" style={{ maxWidth: "400px" }}>
          <div className="d-flex align-items-center justify-content-center mx-auto mb-4 rounded-circle bg-danger bg-opacity-10" style={{ width: "64px", height: "64px" }}>
            <Building2 className="text-danger" size={32} />
          </div>
          <h2 className="h3 fw-bold text-dark mb-3">Access Denied</h2>
          <p className="text-muted">You must be a job seeker to view this page.</p>
          <p className="text-muted">Please log in or sign up with a job seeker account.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Applied Jobs | Empower Her</title>
        <link rel="icon" href="/images/mainlogo1.png" type="image/png" />
      </Head>

      <NavBar />
      <div className="container py-5">
        <h1 className="text-center mb-5 fw-bold text-primary">Your Job Applications</h1>

        {loading && (
          <div className="d-flex justify-content-center align-items-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading applications...</span>
            </div>
            <p className="ms-3 text-muted">Loading your job applications...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        {!loading && applications.length === 0 && !error && (
          <div className="alert alert-info text-center" role="alert">
            You haven&apos;t applied for any jobs yet. <Link href="/find-jobs">Browse jobs</Link> to get started!
          </div>
        )}

        <div className="row row-cols-1 g-4">
          {applications.map((app) => {
            const statusDisplay = getStatusDisplay(app.status);
            if (!app.job) return null;

            return (
              <div key={app._id} className="col">
                <div className="card h-100 shadow-sm border-0 rounded-4 p-4">
                  <div className="card-body">
                    <h5 className="card-title fw-bold text-primary mb-2">
                      {app.job.title}
                    </h5>
                    <h6 className="card-subtitle mb-3 text-muted small">
                      Application ID: {app._id}
                    </h6>
                    <h6 className="card-subtitle mb-3 text-muted small">
                      Applied to: {app.job.providerName || 'N/A'}
                    </h6>
                    <ul className="list-unstyled small mb-3">
                      <li className="d-flex align-items-center mb-1">
                        <Calendar size={16} className="me-2 text-secondary" />
                        Applied on: {new Date(app.appliedAt).toLocaleDateString('en-GB')}
                      </li>
                      <li className="d-flex align-items-center">
                        {statusDisplay.icon}
                        Status: <span className={`ms-1 fw-bold ${statusDisplay.text}`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </li>
                    </ul>
                    <div className="d-flex justify-content-end mt-3">
                      <Link href={`/job/${app.job._id}`} className="btn btn-outline-primary btn-sm rounded-pill px-3">
                        View Job Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}