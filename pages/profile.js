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
        }
        .gradient-header {
          background: linear-gradient(
            90deg,
            #1976d2,
            rgba(25, 118, 210, 0.25),
            #303f9f
          );
        }
        .gradient-button {
          background: linear-gradient(
            90deg,
            #1976d2,
            rgba(25, 118, 210, 0.25),
            #303f9f
          );
        }
        .gradient-button:hover {
          background: linear-gradient(
            90deg,
            #1565c0,
            rgba(25, 118, 210, 0.25),
            #283593
          );
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
          content: "";
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
          content: "";
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
        <div className="container py-5" style={{ maxWidth: "800px" }}>
          <div className="card glass-effect border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="card-body p-5">
              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-dark d-flex align-items-center">
                    <User className="text-primary me-2" size={16} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="form-control form-control-lg bg-light border-2 rounded-4 py-3"
                    style={{ transition: "all 0.3s ease" }}
                  />
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-dark d-flex align-items-center">
                    <Mail className="text-primary me-2" size={16} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    required
                    className="form-control form-control-lg bg-light border-2 rounded-4 py-3"
                    style={{ transition: "all 0.3s ease" }}
                  />
                </div>

                {/* Phone */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-dark d-flex align-items-center">
                    <Phone className="text-primary me-2" size={16} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="form-control form-control-lg bg-light border-2 rounded-4 py-3"
                    style={{ transition: "all 0.3s ease" }}
                  />
                </div>

                {/* City */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-dark d-flex align-items-center">
                    <MapPin className="text-primary me-2" size={16} />
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    className="form-control form-control-lg bg-light border-2 rounded-4 py-3"
                    style={{ transition: "all 0.3s ease" }}
                  />
                </div>

                {/* Profile Picture Upload */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-dark d-flex align-items-center">
                    {/* Changed from Lucide Image icon as we're using Next.js Image directly for preview */}
                    <Image className="text-primary me-2" size={16} />
                    Profile Picture
                  </label>
                  <input
                    type="file"
                    name="profilePicture"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="form-control form-control-lg bg-light border-2 rounded-4 py-3"
                    style={{ transition: "all 0.3s ease" }}
                  />
                  {filePreview && (
                    <div className="mt-3 text-center">
                      <p className="text-muted small mb-2">
                        Current/New Profile Picture:
                      </p>
                      <Image // Changed from <img> to <Image>
                        src={filePreview}
                        alt="Profile Preview" // Added alt prop
                        width={100} // Added width
                        height={100} // Added height
                        className="img-thumbnail rounded-circle"
                        style={{ objectFit: "cover" }} // Use inline style for objectFit
                      />
                    </div>
                  )}
                </div>

                {/* Role (Optional Dropdown) */}
                <div className="mb-5">
                  <label className="form-label fw-semibold text-dark d-flex align-items-center">
                    <Briefcase className="text-primary me-2" size={16} />
                    Your Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="form-select form-select-lg bg-light border-2 rounded-4 py-3"
                    style={{ transition: "all 0.3s ease" }}
                  >
                    <option value="job-seeker">Job Seeker</option>
                    <option value="job-provider">Job Provider</option>
                  </select>
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
                        Updating Profile...
                      </>
                    ) : (
                      <>
                        <User className="me-3" size={20} />
                        Update Profile
                      </>
                    )}
                  </div>
                </button>
              </form>
            </div>
          </div>

          {/* Tips Section - Adapted for Profile Page */}
          <div className="card glass-light border-0 rounded-4 mt-5 p-4">
            <div className="card-body">
              <h3 className="h4 fw-bold text-dark mb-4 d-flex align-items-center">
                <Sparkles className="text-primary me-2" size={20} />
                Tips for a Strong Profile
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
                        Keep it Current
                      </h5>
                      <p className="text-muted small mb-0">
                        Ensure your contact information is always up-to-date.
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
                        Professional Image
                      </h5>
                      <p className="text-muted small mb-0">
                        Consider adding a clear, professional profile picture.
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