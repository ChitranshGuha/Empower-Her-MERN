import React, { useEffect, useState } from "react";
import { User, Phone, Lock, Briefcase, UserCheck } from "lucide-react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useUser } from "@/context/UserContext";
function AuthForm() {
  const router = useRouter();
  const { mode } = router.query;
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    role: "job-seeker",
  });
  useEffect(() => {
    if (mode === "signup") setIsLogin(false);
    else setIsLogin(true);
  }, [mode]);
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const { setUser } = useUser(); // get setter

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      alert(data.message);

      if (isLogin) {
        localStorage.setItem("user", JSON.stringify(data.user)); 
        setUser(data.user);
        router.push("/");
      } else {
        toggleMode();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", phone: "", password: "", role: "job-seeker" });
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 p-4"
      style={{
        background: "linear-gradient(135deg, #ecfeff 0%, #dbeafe 100%)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <Head>
        <title>{isLogin ? "Log In" : "Register"}</title>
        <link rel="icon" href="/images/mainlogo1.png" type="image/png" />
      </Head>
      <div className="w-100" style={{ maxWidth: "400px" }}>
        {/* Header */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center bg-white rounded-circle shadow mb-3"
            style={{ width: "64px", height: "64px" }}
          >
            <UserCheck size={32} style={{ color: "#a6f3ff" }} />
          </div>
          <h1 className="h2 font-weight-bold text-dark mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-muted">
            {isLogin
              ? "Sign in to your account"
              : "Join our job platform today"}
          </p>
        </div>

        {/* Form Card */}
        <div
          className="card shadow-lg border-0"
          style={{ borderRadius: "16px" }}
        >
          <div className="card-body p-4">
            <div>
              {/* Name Field - Only for Signup */}
              {!isLogin && (
                <div className="form-group mb-3">
                  <label className="form-label font-weight-semibold text-dark">
                    Full Name
                  </label>
                  <div className="position-relative">
                    <User
                      className="position-absolute text-muted"
                      size={20}
                      style={{
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 2,
                      }}
                    />
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleInputChange}
                      style={{
                        paddingLeft: "40px",
                        height: "48px",
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #dee2e6",
                        borderRadius: "8px",
                      }}
                      placeholder="Enter your full name"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              {/* Phone Number Field */}
              <div className="form-group mb-3">
                <label className="form-label font-weight-semibold text-dark">
                  Phone Number
                </label>
                <div className="position-relative">
                  <Phone
                    className="position-absolute text-muted"
                    size={20}
                    style={{
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 2,
                    }}
                  />
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={{
                      paddingLeft: "40px",
                      height: "48px",
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      borderRadius: "8px",
                    }}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="form-group mb-3">
                <label className="form-label font-weight-semibold text-dark">
                  Password
                </label>
                <div className="position-relative">
                  <Lock
                    className="position-absolute text-muted"
                    size={20}
                    style={{
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 2,
                    }}
                  />
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleInputChange}
                    style={{
                      paddingLeft: "40px",
                      height: "48px",
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      borderRadius: "8px",
                    }}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {/* Role Selection - Only for Signup */}
              {!isLogin && (
                <div className="form-group mb-4">
                  <label className="form-label font-weight-semibold text-dark">
                    I am a
                  </label>
                  <div className="row">
                    <div className="col-6">
                      <label
                        className={`card h-100 cursor-pointer ${
                          formData.role === "job-seeker"
                            ? "border-primary"
                            : "border-light"
                        }`}
                        style={{
                          borderWidth: "2px",
                          borderRadius: "8px",
                          backgroundColor:
                            formData.role === "job-seeker"
                              ? "#e3f2fd"
                              : "#f8f9fa",
                          borderColor:
                            formData.role === "job-seeker"
                              ? "#a6f3ff"
                              : "#dee2e6",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <input
                          type="radio"
                          name="role"
                          value="job-seeker"
                          checked={formData.role === "job-seeker"}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="card-body text-center py-3">
                          <User className="mx-auto mb-1 text-muted" size={24} />
                          <div className="small font-weight-medium text-dark">
                            Job Seeker
                          </div>
                        </div>
                      </label>
                    </div>
                    <div className="col-6">
                      <label
                        className={`card h-100 cursor-pointer ${
                          formData.role === "job-provider"
                            ? "border-primary"
                            : "border-light"
                        }`}
                        style={{
                          borderWidth: "2px",
                          borderRadius: "8px",
                          backgroundColor:
                            formData.role === "job-provider"
                              ? "#e3f2fd"
                              : "#f8f9fa",
                          borderColor:
                            formData.role === "job-provider"
                              ? "#a6f3ff"
                              : "#dee2e6",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <input
                          type="radio"
                          name="role"
                          value="job-provider"
                          checked={formData.role === "job-provider"}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="card-body text-center py-3">
                          <Briefcase
                            className="mx-auto mb-1 text-muted"
                            size={24}
                          />
                          <div className="small font-weight-medium text-dark">
                            Job Provider
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="btn btn-block font-weight-semibold shadow-sm"
                style={{
                  backgroundColor: "#a6f3ff",
                  border: "none",
                  borderRadius: "8px",
                  height: "48px",
                  color: "white",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                }}
              >
                {isLogin ? "Sign In" : "Create Account"}
              </button>
            </div>

            {/* Toggle Mode */}
            <div className="text-center mt-4">
              <p className="text-muted mb-0">
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="btn btn-link p-0 font-weight-semibold"
                  style={{
                    color: "#a6f3ff",
                    textDecoration: "none",
                  }}
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-4">
          <small className="text-muted">
            There is no force more powerful than a woman determined to rise
          </small>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
