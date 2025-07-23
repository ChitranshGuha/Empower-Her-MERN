// pages/post-job.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router"; // Import useRouter
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  FileText,
  Building2,
  Sparkles,
  Edit2 // Icon for edit mode
} from "lucide-react";
import NavBar from "@/components/NavBar";
import { useUser } from "@/context/UserContext";
import Head from "next/head";

export default function PostJobPage() {
  const router = useRouter(); // Initialize router
  const { edit: jobIdToEdit } = router.query; // Get the jobId from the query parameter
  const { user } = useUser();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    city: "", // Ensure city is in initial state
    salary: "",
    deadline: "",
    // jobType: "Full-time", // If you decide to re-add jobType later
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // New state to track edit mode
  const [initialLoadError, setInitialLoadError] = useState(null); // For errors during initial job data fetch

  // Effect to fetch job data if in edit mode
  useEffect(() => {
    if (jobIdToEdit) {
      setIsEditing(true);
      setLoading(true); // Set loading for initial data fetch

      async function fetchJobData() {
        try {
          const res = await fetch(`/api/jobs/${jobIdToEdit}`); // Call API to get job details
          const data = await res.json();

          if (res.ok) {
            const jobData = data.data;
            setFormData({
              title: jobData.title || "",
              description: jobData.description || "",
              location: jobData.location || "",
              city: jobData.city || "",
              salary: jobData.salary || "",
              deadline: jobData.deadline ? jobData.deadline.substring(0, 10) : "", // Format date to YYYY-MM-DD
              // jobType: jobData.jobType || "Full-time",
            });
          } else {
            setInitialLoadError(data.message || "Failed to load job for editing.");
            console.error("Error loading job for editing:", data.message);
          }
        } catch (err) {
          console.error("Client-side error loading job for editing:", err);
          setInitialLoadError("An error occurred while loading job for editing.");
        } finally {
          setLoading(false);
        }
      }
      fetchJobData();
    } else {
      setIsEditing(false);
      // Reset form if not in edit mode (e.g., navigating from edit back to new post)
      setFormData({
        title: "",
        description: "",
        location: "",
        city: "",
        salary: "",
        deadline: "",
        // jobType: "Full-time",
      });
    }
  }, [jobIdToEdit]); // Dependency: re-run when jobIdToEdit changes (e.g., direct URL change)

  // Access control: Only job providers can post/edit jobs
  if (!user || user.role !== "job-provider") {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ background: "linear-gradient(135deg, #fef7f0, #fdf2f8)" }}
      >
        <div
          className="bg-white p-5 rounded-4 shadow-lg text-center"
          style={{ maxWidth: "400px" }}
        >
          <div
            className="d-flex align-items-center justify-content-center mx-auto mb-4 rounded-circle bg-danger bg-opacity-10"
            style={{ width: "64px", height: "64px" }}
          >
            <Building2 className="text-danger" size={32} />
          </div>
          <h2 className="h3 fw-bold text-dark mb-3">Access Denied</h2>
          <p className="text-muted">Only job providers can {isEditing ? 'edit' : 'post'} jobs.</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Special handling for salary if it's a number field (ensure it's parsed correctly)
    if (name === "salary") {
        setFormData({ ...formData, [name]: value === "" ? "" : parseFloat(value) });
    } else {
        setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setInitialLoadError(null); // Clear any previous errors

    // Determine API endpoint and method based on whether we are editing or posting
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `/api/jobs/${jobIdToEdit}` : "/api/jobs/post";

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          // Add authorization token if you have one
        },
        body: JSON.stringify({
          ...formData,
          provider: user._id, // Add provider ID
          // Convert salary back to string if your backend expects it as string,
          // otherwise keep as number if you updated schema to Number
          // For now, assuming backend expects a number if schema is updated to Number
          salary: parseFloat(formData.salary), // Ensure salary is number when sending
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Job ${isEditing ? 'updated' : 'posted'} successfully!`);
        // Redirect to posted jobs or clear form
        router.push("/posted-job");
      } else {
        setInitialLoadError(data.message || `Failed to ${isEditing ? 'update' : 'post'} job.`);
        alert(data.message || `Failed to ${isEditing ? 'update' : 'post'} job.`);
      }
    } catch (err) {
      console.error(err);
      setInitialLoadError("An error occurred. Please check your network and try again.");
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoadError && isEditing && !loading) {
      return (
          <>
              <NavBar />
              <div className="container py-5 text-center">
                  <div className="alert alert-danger" role="alert">
                      Error loading job: {initialLoadError}
                  </div>
                  <Link href="/posted-job" className="btn btn-primary mt-3">Back to Posted Jobs</Link>
              </div>
          </>
      );
  }

  return (
    <>
      <Head>
        <title>{isEditing ? 'Edit Job' : 'Post a Job'} | Empower Her</title>
        <link rel="icon" href="/images/mainlogo1.png" type="image/png" />
      </Head>

      <style jsx>{`
        .gradient-bg {
          background: linear-gradient(135deg, #e3f2fd, #e8eaf6, #f3e5f5);
          min-height: 100vh;
        }
        .gradient-header {
          background: linear-gradient(90deg, #1976d2, rgba(25, 118, 210, 0.25), #303f9f);
        }
        .gradient-button {
          background: linear-gradient(90deg, #1976d2, rgba(25, 118, 210, 0.25), #303f9f);
        }
        .gradient-button:hover {
          background: linear-gradient(90deg, #1565c0, rgba(25, 118, 210, 0.25), #283593);
          transform: scale(1.02);
        }
        .glass-effect {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .glass-light {
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .form-control:focus {
          border-color: #1976d2;
          box-shadow: 0 0 0 0.2rem rgba(25, 118, 210, 0.25);
        }
        .floating-elements::before {
          content: '';
          position: absolute;
          top: 20px;
          right: 20px;
          width: 128px;
          height: 128px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
          filter: blur(40px);
        }
        .floating-elements::after {
          content: '';
          position: absolute;
          bottom: 20px;
          left: 20px;
          width: 96px;
          height: 96px;
          background: rgba(123, 31, 162, 0.2);
          border-radius: 50%;
          filter: blur(30px);
        }
      `}</style>

      <div className="gradient-bg">
        <NavBar />
        <div className="container py-5" style={{ maxWidth: "1000px" }}>
          <div className="card glass-effect border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="gradient-header text-white text-center py-5 position-relative floating-elements">
              <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ background: "rgba(0,0,0,0.1)" }}
              ></div>
              <div className="position-relative" style={{ zIndex: 10 }}>
                <div
                  className="d-flex align-items-center justify-content-center mx-auto mb-4 rounded-circle"
                  style={{
                    width: "80px",
                    height: "80px",
                    background: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(5px)",
                  }}
                >
                  {isEditing ? <Edit2 className="text-white" size={40} /> : <Sparkles className="text-white" size={40} />}
                </div>
                <h2 className="h1 fw-bold mb-4">{isEditing ? 'Edit Job Opening' : 'Post a New Job'}</h2>
                <p
                  className="lead mx-auto"
                  style={{ maxWidth: "600px", color: "#e3f2fd" }}
                >
                  {isEditing ? 'Update the details of your job listing.' : 'Create a compelling job posting that attracts top talent to your organization.'}
                </p>
              </div>
            </div>

            <div className="card-body p-5">
              <form onSubmit={handleSubmit}>
                {/* Job Title */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-dark d-flex align-items-center">
                    <Briefcase className="text-primary me-2" size={16} />
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter Job Title"
                    required
                    className="form-control form-control-lg bg-light border-2 rounded-4 py-3"
                    style={{ transition: "all 0.3s ease" }}
                  />
                </div>

                {/* Job Description */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-dark d-flex align-items-center">
                    <FileText className="text-primary me-2" size={16} />
                    Job Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the role, responsibilities, and requirements..."
                    required
                    rows={6}
                    className="form-control bg-light border-2 rounded-4 py-3"
                    style={{ resize: "none", transition: "all 0.3s ease" }}
                  />
                </div>

                {/* Location & City Row */}
                <div className="row mb-4">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label className="form-label fw-semibold text-dark d-flex align-items-center">
                      <MapPin className="text-primary me-2" size={16} />
                      Location (e.g., Remote, On-site, Hybrid)
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Enter the job location (e.g., Remote, On-site, Hybrid)"
                      required
                      className="form-control form-control-lg bg-light border-2 rounded-4 py-3"
                      style={{ transition: "all 0.3s ease" }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark d-flex align-items-center">
                      <MapPin className="text-primary me-2" size={16} />
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter the city (e.g., Bhopal, Mumbai)"
                      required
                      className="form-control form-control-lg bg-light border-2 rounded-4 py-3"
                      style={{ transition: "all 0.3s ease" }}
                    />
                  </div>
                </div>

                {/* Salary Offered */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-dark d-flex align-items-center">
                    <DollarSign className="text-primary me-2" size={16} />
                    Salary Offered (Numerical value, e.g., 50000)
                  </label>
                  <input
                    type="number" // Changed to type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="Enter salary (e.g., 50000)"
                    required
                    className="form-control form-control-lg bg-light border-2 rounded-4 py-3"
                    style={{ transition: "all 0.3s ease" }}
                  />
                </div>

                {/* Application Deadline */}
                <div className="mb-5">
                  <label className="form-label fw-semibold text-dark d-flex align-items-center">
                    <Calendar className="text-primary me-2" size={16} />
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                    className="form-control form-control-lg bg-light border-2 rounded-4 py-3"
                    style={{ transition: "all 0.3s ease" }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-lg w-100 gradient-button text-white fw-semibold py-4 rounded-4 border-0 position-relative overflow-hidden"
                  style={{ transition: "all 0.3s ease", fontSize: "1.1rem" }}
                >
                  <div className="d-flex align-items-center justify-content-center">
                    {loading ? (
                      <>
                        <div
                          className="spinner-border spinner-border-sm me-3 text-white"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        {isEditing ? 'Updating Job...' : 'Posting Job...'}
                      </>
                    ) : (
                      <>
                        {isEditing ? <Edit2 className="me-3" size={20} /> : <Briefcase className="me-3" size={20} />}
                        {isEditing ? 'Update Job' : 'Post Job Opening'}
                      </>
                    )}
                  </div>
                </button>
              </form>
            </div>
          </div>

          {/* Tips Section */}
          <div className="card glass-light border-0 rounded-4 mt-5 p-4">
            <div className="card-body">
              <h3 className="h4 fw-bold text-dark mb-4 d-flex align-items-center">
                <Sparkles className="text-primary me-2" size={20} />
                Pro Tips for Better Job Posts
              </h3>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="d-flex">
                    <div
                      className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle me-3 flex-shrink-0"
                      style={{
                        width: "32px",
                        height: "32px",
                        marginTop: "4px",
                      }}
                    >
                      <span className="text-primary fw-semibold small">1</span>
                    </div>
                    <div>
                      <h5 className="fw-semibold text-dark mb-1">
                        Be Specific
                      </h5>
                      <p className="text-muted small mb-0">
                        Include specific skills, experience level, and
                        day-to-day responsibilities.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="d-flex">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle me-3 flex-shrink-0"
                      style={{
                        width: "32px",
                        height: "32px",
                        marginTop: "4px",
                        background: "rgba(123, 31, 162, 0.1)",
                      }}
                    >
                      <span
                        className="fw-semibold small"
                        style={{ color: "#7b1fa2" }}
                      >
                        2
                      </span>
                    </div>
                    <div>
                      <h5 className="fw-semibold text-dark mb-1">
                        Highlight Benefits
                      </h5>
                      <p className="text-muted small mb-0">
                        Mention company culture, growth opportunities, and
                        unique perks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}