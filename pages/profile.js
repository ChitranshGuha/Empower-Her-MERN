import { useUser } from "@/context/UserContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import NavBar from "@/components/NavBar";
import Head from "next/head";
import Image from "next/image";
import { 
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Sparkles,
  Camera,
  Edit3,
  Shield,
  Star,
} from "lucide-react";

export default function ProfilePage() {
  const { user, setUser } = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    _id: user?._id || "",
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    imageUrl: user?.imageUrl || "",
    role: user?.role || "job-seeker",
    city: user?.city || "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(user?.imageUrl || null);

  useEffect(() => {
    if (user) {
      setFormData({
        _id: user._id,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        imageUrl: user.imageUrl || "",
        role: user.role || "job-seeker",
        city: user.city || "",
      });
      setFilePreview(user.imageUrl || null);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setFilePreview(formData.imageUrl || null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = new FormData();

    for (const key in formData) {
      if (formData[key] !== null && key !== "imageUrl") {
        dataToSend.append(key, formData[key]);
      }
    }

    if (selectedFile) {
      dataToSend.append("profilePicture", selectedFile);
    } else if (formData.imageUrl) {
      dataToSend.append("imageUrl", formData.imageUrl);
    }

    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        body: dataToSend,
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        setSelectedFile(null);
        setFilePreview(data.user.imageUrl);
        alert("Profile updated successfully");
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Edit Profile | Empower Her</title>
        <link rel="icon" href="/images/mainlogo1.png" type="image/png" />
      </Head>

      <style jsx>{`
        .gradient-bg {
          background: linear-gradient(135deg, #e3f2fd, #e8eaf6, #f3e5f5);
          min-height: 100vh;
          position: relative;
        }
        .gradient-header {
          background: linear-gradient(
            135deg,
            #1976d2 0%,
            #303f9f 100%
          );
        }
        .gradient-button {
          background: linear-gradient(
            135deg,
            #1976d2 0%,
            #303f9f 100%
          );
        }
        .gradient-button:hover {
          background: linear-gradient(
            135deg,
            #1565c0 0%,
            #283593 100%
          );
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(25, 118, 210, 0.3);
        }
        .glass-effect {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }
        .glass-light {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
        }
        .profile-header {
          background: linear-gradient(
            135deg,
            #1976d2 0%,
            rgba(25, 118, 210, 0.8) 50%,
            #303f9f 100%
          );
          position: relative;
          overflow: hidden;
        }
        .profile-header::before {
          content: "";
          position: absolute;
          top: -50%;
          right: -20%;
          width: 200px;
          height: 200px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          filter: blur(40px);
        }
        .profile-header::after {
          content: "";
          position: absolute;
          bottom: -30%;
          left: -10%;
          width: 150px;
          height: 150px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 50%;
          filter: blur(30px);
        }
        .form-control:focus {
          border-color: #1976d2;
          box-shadow: 0 0 0 0.2rem rgba(25, 118, 210, 0.15);
          transform: translateY(-1px);
        }
        .form-control {
          transition: all 0.3s ease;
          border: 1px solid #e0e0e0;
        }
        .form-control:hover {
          border-color: #1976d2;
        }
        .input-group {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          color: #1976d2;
        }
        .form-control.with-icon {
          padding-left: 45px;
        }
        .profile-avatar {
          position: relative;
          display: inline-block;
        }
        .avatar-overlay {
          position: absolute;
          bottom: 0;
          right: 0;
          background: #1976d2;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .avatar-overlay:hover {
          background: #1565c0;
          transform: scale(1.1);
        }
        .role-card {
          transition: all 0.3s ease;
          cursor: pointer;
          border: 2px solid transparent;
        }
        .role-card:hover {
          border-color: #1976d2;
          transform: translateY(-2px);
        }
        .role-card.selected {
          border-color: #1976d2;
          background: rgba(25, 118, 210, 0.05);
        }
        .floating-shapes {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }
        .shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.03);
          filter: blur(20px);
        }
        .shape-1 {
          top: 10%;
          right: 15%;
          width: 120px;
          height: 120px;
        }
        .shape-2 {
          bottom: 20%;
          left: 10%;
          width: 80px;
          height: 80px;
          background: rgba(123, 31, 162, 0.05);
        }
        .tip-card {
          transition: all 0.3s ease;
        }
        .tip-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        .section-divider {
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(25, 118, 210, 0.3),
            transparent
          );
          margin: 2rem 0;
        }
      `}</style>

      <div className="gradient-bg">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
        </div>
        
        <NavBar />
        
        <div className="container py-4" style={{ maxWidth: "900px", position: "relative", zIndex: 1 }}>
          {/* Profile Header */}
          <div className="card glass-effect border-0 rounded-4 overflow-hidden mb-4">
            <div className="profile-header text-white p-4">
              <div className="row align-items-center">
                <div className="col-auto">
                  <div className="profile-avatar">
                    <div 
                      className="bg-white bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "80px", height: "80px" }}
                    >
                      {filePreview ? (
                        <Image
                          src={filePreview}
                          alt="Profile"
                          width={80}
                          height={80}
                          className="rounded-circle"
                          style={{ objectFit: "cover", width: "80px", height: "80px" }}
                        />
                      ) : (
                        <User size={32} className="text-white" />
                      )}
                    </div>
                    <label htmlFor="profilePicture" className="avatar-overlay">
                      <Camera size={16} className="text-white" />
                    </label>
                  </div>
                </div>
                <div className="col">
                  <h2 className="h3 mb-1 fw-bold">
                    {formData.name || "Your Name"}
                  </h2>
                  <p className="mb-2 opacity-90">
                    {formData.role === "job-seeker" ? "Job Seeker" : "Job Provider"}
                  </p>
                  <div className="d-flex align-items-center">
                    <MapPin size={14} className="me-1 opacity-75" />
                    <small className="opacity-90">
                      {formData.city || "City not specified"}
                    </small>
                  </div>
                </div>
                <div className="col-auto">
                  <div className="d-flex align-items-center">
                    <Edit3 size={20} className="me-2 opacity-75" />
                    <span className="fw-semibold">Edit Profile</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Personal Information Card */}
              <div className="col-lg-8">
                <div className="card glass-effect border-0 rounded-4 h-100">
                  <div className="card-body p-4">
                    <h4 className="fw-bold text-dark mb-4 d-flex align-items-center">
                      <User className="text-primary me-2" size={20} />
                      Personal Information
                    </h4>

                    <div className="row g-3">
                      {/* Name */}
                      <div className="col-12">
                        <div className="input-group">
                          <User className="input-icon" size={16} />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                            className="form-control form-control-lg with-icon rounded-3 py-3"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="col-md-6">
                        <div className="input-group">
                          <Mail className="input-icon" size={16} />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                            required
                            className="form-control form-control-lg with-icon rounded-3 py-3"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="col-md-6">
                        <div className="input-group">
                          <Phone className="input-icon" size={16} />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            className="form-control form-control-lg with-icon rounded-3 py-3"
                          />
                        </div>
                      </div>

                      {/* City */}
                      <div className="col-md-6">
                        <div className="input-group">
                          <MapPin className="input-icon" size={16} />
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Enter your city"
                            className="form-control form-control-lg with-icon rounded-3 py-3"
                          />
                        </div>
                      </div>

                      {/* Hidden file input */}
                      <input
                        id="profilePicture"
                        type="file"
                        name="profilePicture"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="d-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Selection Card */}
              <div className="col-lg-4">
                <div className="card glass-effect border-0 rounded-4 h-100">
                  <div className="card-body p-4">
                    <h5 className="fw-bold text-dark mb-4 d-flex align-items-center">
                      <Briefcase className="text-primary me-2" size={18} />
                      Your Role
                    </h5>

                    <div className="d-grid gap-3">
                      <div 
                        className={`role-card p-3 rounded-3 ${formData.role === 'job-seeker' ? 'selected' : ''}`}
                        onClick={() => setFormData({...formData, role: 'job-seeker'})}
                      >
                        <div className="d-flex align-items-center">
                          <div 
                            className="bg-primary bg-opacity-10 rounded-circle me-3 d-flex align-items-center justify-content-center"
                            style={{ width: "40px", height: "40px" }}
                          >
                            <User size={18} className="text-primary" />
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-semibold">Job Seeker</h6>
                            <small className="text-muted">Looking for opportunities</small>
                          </div>
                          <input
                            type="radio"
                            name="role"
                            value="job-seeker"
                            checked={formData.role === 'job-seeker'}
                            onChange={handleChange}
                            className="form-check-input"
                          />
                        </div>
                      </div>

                      <div 
                        className={`role-card p-3 rounded-3 ${formData.role === 'job-provider' ? 'selected' : ''}`}
                        onClick={() => setFormData({...formData, role: 'job-provider'})}
                      >
                        <div className="d-flex align-items-center">
                          <div 
                            className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                            style={{ 
                              width: "40px", 
                              height: "40px",
                              background: "rgba(123, 31, 162, 0.1)"
                            }}
                          >
                            <Briefcase size={18} style={{ color: "#7b1fa2" }} />
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-semibold">Job Provider</h6>
                            <small className="text-muted">Offering opportunities</small>
                          </div>
                          <input
                            type="radio"
                            name="role"
                            value="job-provider"
                            checked={formData.role === 'job-provider'}
                            onChange={handleChange}
                            className="form-check-input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-lg w-100 gradient-button text-white fw-semibold py-4 rounded-4 border-0"
                style={{ transition: "all 0.3s ease", fontSize: "1.1rem" }}
              >
                {loading ? (
                  <div className="d-flex align-items-center justify-content-center">
                    <div
                      className="spinner-border spinner-border-sm me-3 text-white"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Updating Profile...
                  </div>
                ) : (
                  <div className="d-flex align-items-center justify-content-center">
                    <Shield className="me-3" size={20} />
                    Update Profile
                  </div>
                )}
              </button>
            </div>
          </form>

          <div className="section-divider"></div>

          {/* Tips Section */}
          <div className="card glass-light border-0 rounded-4">
            <div className="card-body p-4">
              <h4 className="fw-bold text-dark mb-4 d-flex align-items-center">
                <Sparkles className="text-primary me-2" size={20} />
                Profile Enhancement Tips
              </h4>
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="tip-card h-100 p-3 rounded-3 bg-white bg-opacity-50">
                    <div 
                      className="bg-primary bg-opacity-10 rounded-circle mb-3 mx-auto d-flex align-items-center justify-content-center"
                      style={{ width: "48px", height: "48px" }}
                    >
                      <Star size={20} className="text-primary" />
                    </div>
                    <h6 className="fw-semibold text-center mb-2">Stay Updated</h6>
                    <p className="text-muted small text-center mb-0">
                      Keep your contact information and skills current for better opportunities.
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="tip-card h-100 p-3 rounded-3 bg-white bg-opacity-50">
                    <div 
                      className="rounded-circle mb-3 mx-auto d-flex align-items-center justify-content-center"
                      style={{ 
                        width: "48px", 
                        height: "48px",
                        background: "rgba(123, 31, 162, 0.1)"
                      }}
                    >
                      <Camera size={20} style={{ color: "#7b1fa2" }} />
                    </div>
                    <h6 className="fw-semibold text-center mb-2">Professional Image</h6>
                    <p className="text-muted small text-center mb-0">
                      Add a clear, professional photo to build trust and recognition.
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="tip-card h-100 p-3 rounded-3 bg-white bg-opacity-50">
                    <div 
                      className="bg-success bg-opacity-10 rounded-circle mb-3 mx-auto d-flex align-items-center justify-content-center"
                      style={{ width: "48px", height: "48px" }}
                    >
                      <Shield size={20} className="text-success" />
                    </div>
                    <h6 className="fw-semibold text-center mb-2">Complete Profile</h6>
                    <p className="text-muted small text-center mb-0">
                      Fill all fields to increase your profile visibility and credibility.
                    </p>
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