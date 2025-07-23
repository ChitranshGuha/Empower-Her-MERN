// pages/find-jobs.js
import Head from 'next/head';
import NavBar from '@/components/NavBar';
import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import { Briefcase, MapPin, DollarSign, Calendar, Building2, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default function FindJobsPage() {
  const { user } = useUser();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set()); // Store IDs of jobs user has applied to

  // --- Filter States ---
  const [filterTitle, setFilterTitle] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterMinSalary, setFilterMinSalary] = useState('');
  // --- End Filter States ---

  // Function to fetch jobs based on filters
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (filterTitle) queryParams.append('title', filterTitle);
      if (filterLocation) queryParams.append('location', filterLocation);
      if (filterCity) queryParams.append('city', filterCity);
      if (filterMinSalary) queryParams.append('minSalary', filterMinSalary);

      const url = `/api/jobs?${queryParams.toString()}`;
      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        if (Array.isArray(data.data)) {
          setJobs(data.data);
        } else {
          setError('Received data is not an array of jobs.');
          setJobs([]);
        }
      } else {
        setError(data.message || 'Failed to fetch jobs.');
        setJobs([]);
      }
    } catch (err) {
      console.error('Client-side error fetching jobs:', err);
      setError('An error occurred while connecting to the server.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [filterTitle, filterLocation, filterCity, filterMinSalary]);

  // Function to fetch user's applied jobs
  const fetchAppliedJobs = useCallback(async () => {
    if (!user || user.role !== 'job-seeker') {
      setAppliedJobIds(new Set()); // Clear if not a job seeker or not logged in
      return;
    }

    try {
      // Assuming you'll create an API route like /api/jobs/applied/[userId]
      const res = await fetch(`/api/jobs/applied/${user._id}`);
      const data = await res.json();

      if (res.ok && Array.isArray(data.data)) {
        // Create a Set of job IDs for quick lookup
        const ids = new Set(data.data.map(app => app.job._id || app.job)); // Handle if 'job' is an object or just ID
        setAppliedJobIds(ids);
      } else {
        console.error('Failed to fetch applied jobs:', data.message || 'Unknown error');
        setAppliedJobIds(new Set());
      }
    } catch (err) {
      console.error('Client-side error fetching applied jobs:', err);
      setAppliedJobIds(new Set());
    }
  }, [user]); // Dependency on user to refetch if user changes (e.g., login/logout)

  // Combined useEffect to fetch both jobs and applied jobs
  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
  }, [fetchJobs, fetchAppliedJobs]); // Re-run if fetch functions change

  const handleClearFilters = () => {
    setFilterTitle('');
    setFilterLocation('');
    setFilterCity('');
    setFilterMinSalary('');
  };

  // Optional: Restrict access to job seekers if needed
  if (!user || user.role !== 'job-seeker') {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="bg-white p-5 rounded-4 shadow-lg text-center" style={{ maxWidth: "400px" }}>
          <div className="d-flex align-items-center justify-content-center mx-auto mb-4 rounded-circle bg-danger bg-opacity-10" style={{ width: "64px", height: "64px" }}>
            <Building2 className="text-danger" size={32} />
          </div>
          <h2 className="h3 fw-bold text-dark mb-3">Access Denied</h2>
          <p className="text-muted">Only job seekers can view job listings.</p>
          <p className="text-muted">Please log in as a job seeker or sign up.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Find Jobs | Empower Her</title>
        <link rel="icon" href="/images/mainlogo1.png" type="image/png" />
      </Head>

      <NavBar />
      <div className="container py-5">
        <h1 className="text-center mb-5 fw-bold text-primary">Discover Job Opportunities</h1>

        {/* --- Filter Section --- */}
        <div className="card mb-4 shadow-sm border-0 rounded-4 p-4 bg-light">
          <h3 className="card-title mb-3 fw-bold text-secondary d-flex align-items-center">
            <Filter size={20} className="me-2 text-primary" /> Filter Jobs
          </h3>
          <div className="row g-3">
            <div className="col-md-6 col-lg-3">
              <label htmlFor="filterTitle" className="form-label small text-muted">Job Title</label>
              <div className="input-group">
                <span className="input-group-text"><Briefcase size={18} /></span>
                <input
                  type="text"
                  className="form-control"
                  id="filterTitle"
                  placeholder="e.g., Software Engineer"
                  value={filterTitle}
                  onChange={(e) => setFilterTitle(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <label htmlFor="filterLocation" className="form-label small text-muted">Location</label>
              <div className="input-group">
                <span className="input-group-text"><MapPin size={18} /></span>
                <input
                  type="text"
                  className="form-control"
                  id="filterLocation"
                  placeholder="e.g., Remote, On-site"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <label htmlFor="filterCity" className="form-label small text-muted">City</label>
              <div className="input-group">
                <span className="input-group-text"><MapPin size={18} /></span>
                <input
                  type="text"
                  className="form-control"
                  id="filterCity"
                  placeholder="e.g., Bhopal, Indore"
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <label htmlFor="filterMinSalary" className="form-label small text-muted">Min Salary</label>
              <div className="input-group">
                <span className="input-group-text"><DollarSign size={18} /></span>
                <input
                  type="number"
                  className="form-control"
                  id="filterMinSalary"
                  placeholder="e.g., 50000"
                  value={filterMinSalary}
                  onChange={(e) => setFilterMinSalary(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-outline-secondary me-2" onClick={handleClearFilters}>
              Clear Filters
            </button>
            <button className="btn btn-primary" onClick={fetchJobs}>
              <Search size={18} className="me-2" /> Search
            </button>
          </div>
        </div>
        {/* --- End Filter Section --- */}

        {loading && (
          <div className="d-flex justify-content-center align-items-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading jobs...</span>
            </div>
            <p className="ms-3 text-muted">Loading available jobs...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        {!loading && jobs.length === 0 && !error && (
          <div className="alert alert-info text-center" role="alert">
            No job opportunities found matching your criteria.
          </div>
        )}

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {jobs.map((job) => {
            const hasApplied = appliedJobIds.has(job._id); // Check if user has applied to this job

            return (
              <div key={job._id} className="col">
                <div className="card h-100 shadow-sm border-0 rounded-4 p-3">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold text-primary mb-2">{job.title}</h5>
                    <h6 className="card-subtitle mb-3 text-muted small">
                      Posted by: {job.providerName || 'N/A'}
                    </h6>
                    <p className="card-text text-secondary mb-3 flex-grow-1" style={{ fontSize: '0.9rem' }}>
                      {job.description.length > 150
                        ? job.description.substring(0, 150) + '...'
                        : job.description}
                    </p>
                    <ul className="list-unstyled small text-muted mb-3">
                      <li className="d-flex align-items-center mb-1">
                        <MapPin size={16} className="me-2 text-info" />
                        {job.location}, {job.city}
                      </li>
                      <li className="d-flex align-items-center mb-1">
                        <DollarSign size={16} className="me-2 text-success" />
                        Salary: {job.salary}
                      </li>
                      <li className="d-flex align-items-center">
                        <Calendar size={16} className="me-2 text-warning" />
                        Deadline: {new Date(job.deadline).toLocaleDateString('en-GB')}
                      </li>
                    </ul>
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <Link href={`/job/${job._id}`} className="btn btn-outline-primary btn-sm rounded-pill px-3">
                        View Details
                      </Link>
                      {/* Conditional rendering for Apply/Applied button */}
                      {hasApplied ? (
                        <button className="btn btn-success btn-sm rounded-pill px-3" disabled>
                          Applied
                        </button>
                      ) : (
                        <Link href={`/job/${job._id}`} className="btn btn-primary btn-sm rounded-pill px-3">
                          Apply Now
                        </Link>
                      )}
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