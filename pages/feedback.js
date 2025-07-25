import Head from 'next/head';
import NavBar from '@/components/NavBar';
import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { Mail, MessageSquare, Star, Send } from 'lucide-react';
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
      <div className="container py-5">
        <h1 className="text-center mb-5 fw-bold text-primary">Share Your Feedback</h1>

        <div className="card shadow-lg border-0 rounded-4 p-4 mx-auto" style={{ maxWidth: '700px' }}>
          <div className="card-body">
            <p className="lead text-center text-muted mb-4">
              We value your thoughts and suggestions. Please let us know how we can improve!
            </p>

            <form onSubmit={handleSubmit}>
              {/* Subject Field */}
              <div className="mb-3">
                <label htmlFor="subject" className="form-label fw-semibold text-dark d-flex align-items-center">
                  <Mail size={16} className="me-2 text-primary" /> Subject
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Website improvement, feature request"
                  required
                />
              </div>

              {/* Message Field */}
              <div className="mb-3">
                <label htmlFor="message" className="form-label fw-semibold text-dark d-flex align-items-center">
                  <MessageSquare size={16} className="me-2 text-primary" /> Your Message
                </label>
                <textarea
                  className="form-control form-control-lg"
                  id="message"
                  rows="5"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your feedback in detail..."
                  required
                ></textarea>
              </div>

              {/* Rating Field (Star Rating) */}
              <div className="mb-4">
                <label className="form-label fw-semibold text-dark d-flex align-items-center">
                  <Star size={16} className="me-2 text-primary" /> Overall Rating
                </label>
                <StarRating
                  initialRating={rating} 
                  onRatingChange={handleRatingChange} 
                />
              </div>

              {/* Submit Button */}
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary btn-lg rounded-pill py-3" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={20} className="me-2" /> Submit Feedback
                    </>
                  )}
                </button>
              </div>

              {/* Form Feedback Message */}
              {formFeedback && (
                <div className={`alert mt-3 text-center ${formFeedback.includes('successfully') ? 'alert-success' : 'alert-danger'}`} role="alert">
                  {formFeedback}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}