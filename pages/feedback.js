import Head from 'next/head';
import NavBar from '@/components/NavBar';
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { Mail, MessageSquare, Star, Send, Heart, Sparkles, Users, Target } from 'lucide-react';
import StarRating from '@/components/StarRating'; 

export default function FeedbackPage() {
  const { user } = useUser();

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0); 
  const [formFeedback, setFormFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const userName = user ? user.name : '';
  const userEmail = user ? user.email : '';
  const userId = user ? user._id : null;

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormFeedback('');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          userName,
          userEmail,
          subject,
          message,
          rating,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setFormFeedback('Thank you for your feedback! It has been submitted successfully. 😊');
        setSubject('');
        setMessage('');
        setRating(0);
      } else {
        setFormFeedback(data.message || 'Failed to submit feedback. Please try again. 😢');
      }
    } catch (err) {
      console.error('Client-side error submitting feedback:', err);
      setFormFeedback('An unexpected error occurred. Please try again later. 😟');
    } finally {
      setLoading(false);
      setTimeout(() => setFormFeedback(''), 5000);
    }
  };

  return (
    <>
      <Head>
        <title>Feedback | Empower Her</title>
        <link rel="icon" href="/images/mainlogo1.png" type="image/png" />
      </Head>

      <NavBar />
      
      {/* Hero Section */}
      <div className="position-relative overflow-hidden">
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(135deg, rgba(138, 43, 226, 0.1) 0%, rgba(30, 144, 255, 0.1) 50%, rgba(255, 20, 147, 0.1) 100%)',
            zIndex: -1
          }}
        ></div>
        
        {/* Floating Elements */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: -1 }}>
          <div className="position-absolute" style={{ top: '10%', left: '85%', animation: 'float 6s ease-in-out infinite' }}>
            <Heart size={24} className="text-primary opacity-50" />
          </div>
          <div className="position-absolute" style={{ top: '20%', left: '10%', animation: 'float 8s ease-in-out infinite 2s' }}>
            <Sparkles size={20} className="text-info opacity-40" />
          </div>
          <div className="position-absolute" style={{ top: '60%', left: '90%', animation: 'float 7s ease-in-out infinite 4s' }}>
            <Star size={18} className="text-warning opacity-50" />
          </div>
        </div>

        <div className="container py-5">
          {/* Split Layout: Content Left, Form Right */}
          <div className="row min-vh-100">
            {/* Left Side - Content */}
            <div className="col-lg-6 pe-lg-5 d-flex flex-column justify-content-start pt-4">
              <div className="text-start">
                <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle p-3 mb-4">
                  <MessageSquare size={32} className="text-primary" />
                </div>
                <h1 className="display-4 fw-bold mb-3" style={{ 
                  background: 'linear-gradient(135deg, #8a2be2 0%, #1e90ff 50%, #ff1493 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Your Voice Matters
                </h1>
                <p className="lead text-muted mb-5">Help us create something amazing together</p>
              </div>

              {/* Stats Cards - Vertical Layout */}
              <div className="row g-4">
                <div className="col-12">
                  <div className="card border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '20px' }}>
                    <div className="card-body text-white p-4">
                      <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center justify-content-center rounded-circle me-4" style={{ backgroundColor: 'rgba(255,255,255,0.2)', width: '50px', height: '50px' }}>
                          <Users size={24} />
                        </div>
                        <div>
                          <h5 className="fw-bold mb-1">Community Driven</h5>
                          <p className="mb-0 small opacity-90">Built by feedback from amazing users like you</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="card border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', borderRadius: '20px' }}>
                    <div className="card-body text-white p-4">
                      <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center justify-content-center rounded-circle me-4" style={{ backgroundColor: 'rgba(255,255,255,0.2)', width: '50px', height: '50px' }}>
                          <Target size={24} />
                        </div>
                        <div>
                          <h5 className="fw-bold mb-1">Continuous Growth</h5>
                          <p className="mb-0 small opacity-90">Every suggestion helps us improve and evolve</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="card border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', borderRadius: '20px' }}>
                    <div className="card-body text-white p-4">
                      <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center justify-content-center rounded-circle me-4" style={{ backgroundColor: 'rgba(255,255,255,0.2)', width: '50px', height: '50px' }}>
                          <Heart size={24} />
                        </div>
                        <div>
                          <h5 className="fw-bold mb-1">Made with Care</h5>
                          <p className="mb-0 small opacity-90">Your experience is our top priority</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Enhanced Form Card */}
            <div className="col-lg-6 ps-lg-5 d-flex align-items-center">
              <div className="card border-0 shadow-lg position-relative overflow-hidden" style={{ borderRadius: '24px' }}>
                {/* Gradient Border Effect */}
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
                  padding: '2px',
                  borderRadius: '24px',
                  zIndex: 1
                }}>
                  <div className="bg-white w-100 h-100" style={{ borderRadius: '22px' }}></div>
                </div>

                <div className="card-body p-4 position-relative" style={{ zIndex: 2 }}>
                  <div className="text-center mb-4">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-3" style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      width: '80px',
                      height: '80px'
                    }}>
                      <Send size={32} className="text-white" />
                    </div>
                    <h3 className="fw-bold text-dark mb-2">Share Your Thoughts</h3>
                    <p className="text-muted mb-0">Every piece of feedback helps us build something better</p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {/* Subject Field */}
                    <div className="mb-4">
                      <label htmlFor="subject" className="form-label fw-semibold text-dark d-flex align-items-center mb-3">
                        <div className="d-inline-flex align-items-center justify-content-center rounded-circle me-3" style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          width: '32px',
                          height: '32px'
                        }}>
                          <Mail size={14} className="text-white" />
                        </div>
                        Subject
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg border-0 shadow-sm"
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="What would you like to discuss?"
                        required
                        style={{
                          borderRadius: '16px',
                          backgroundColor: '#f8f9fc',
                          padding: '18px 24px',
                          fontSize: '16px',
                          transition: 'all 0.3s ease',
                          border: '1px solid black'
                        }}
                        onFocus={(e) => {
                          e.target.style.backgroundColor = '#ffffff';
                          e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.backgroundColor = '#f8f9fc';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>

                    {/* Message Field */}
                    <div className="mb-4">
                      <label htmlFor="message" className="form-label fw-semibold text-dark d-flex align-items-center mb-3">
                        <div className="d-inline-flex align-items-center justify-content-center rounded-circle me-3" style={{
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          width: '32px',
                          height: '32px'
                        }}>
                          <MessageSquare size={14} className="text-white" />
                        </div>
                        Your Message
                      </label>
                      <textarea
                        className="form-control form-control-lg border-0 shadow-sm"
                        id="message"
                        rows="6"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us more about your experience, suggestions, or any concerns you might have..."
                        required
                        style={{
                          borderRadius: '16px',
                          backgroundColor: '#f8f9fc',
                          padding: '18px 24px',
                          fontSize: '16px',
                          resize: 'none',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.backgroundColor = '#ffffff';
                          e.target.style.boxShadow = '0 0 0 3px rgba(240, 147, 251, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.backgroundColor = '#f8f9fc';
                          e.target.style.boxShadow = 'none';
                        }}
                      ></textarea>
                    </div>

                    {/* Rating Field */}
                    <div className="mb-5">
                      <label className="form-label fw-semibold text-dark d-flex align-items-center mb-3">
                        <div className="d-inline-flex align-items-center justify-content-center rounded-circle me-3" style={{
                          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                          width: '32px',
                          height: '32px'
                        }}>
                          <Star size={14} className="text-white" />
                        </div>
                        Overall Experience
                      </label>
                      <div className="p-4 rounded-4" style={{ backgroundColor: '#f8f9fc' }}>
                        <div className="text-center">
                          <p className="text-muted mb-3">How would you rate your overall experience?</p>
                          <StarRating
                            initialRating={rating} 
                            onRatingChange={handleRatingChange} 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                      <button 
                        type="submit" 
                        className="btn btn-lg px-5 py-3 border-0 text-white position-relative overflow-hidden"
                        disabled={loading}
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: '50px',
                          fontSize: '18px',
                          fontWeight: '600',
                          minWidth: '200px',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
                        }}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Sending your feedback...
                          </>
                        ) : (
                          <>
                            <Send size={20} className="me-2" /> 
                            Send Feedback
                          </>
                        )}
                      </button>
                    </div>

                    {/* Form Feedback Message */}
                    {formFeedback && (
                      <div 
                        className={`mt-4 p-4 text-center border-0 ${formFeedback.includes('successfully') ? 'text-success' : 'text-danger'}`}
                        style={{
                          backgroundColor: formFeedback.includes('successfully') ? '#d4edda' : '#f8d7da',
                          borderRadius: '16px',
                          fontSize: '16px',
                          fontWeight: '500'
                        }}
                        role="alert"
                      >
                        {formFeedback}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        
        .form-control:focus {
          outline: none !important;
        }
      `}</style>
    </>
  );
}