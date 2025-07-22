// components/sections/QuerySection.jsx
import { useState } from 'react'; // Keep useState if you want controlled inputs; otherwise, it's not strictly needed here
import Image from "next/image"; // Keep Image component if still used

export default function QuerySection() {
  const [formFeedback, setFormFeedback] = useState(''); // State for user feedback (success/error)
  const [loading, setLoading] = useState(false); // State for loading indicator

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const form = e.target;
    const name = form.username.value;
    const phone = form.phone.value;
    const email = form.email.value;
    const query = form.query.value;

    try {
      const res = await fetch('/api/submit-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone, email, query }),
      });

      const data = await res.json();

      if (res.ok) {
        setFormFeedback('Your query has been submitted successfully! We will get back to you soon. 😊');
        form.reset(); // Clear the form fields on success
      } else {
        setFormFeedback(data.message || 'Failed to submit your query. Please try again. 😢');
      }
    } catch (error) {
      console.error("Query submission error:", error);
      setFormFeedback('An unexpected error occurred. Please try again later. 😟');
    } finally {
      setLoading(false); // End loading
      // Optional: clear feedback after some time
      setTimeout(() => setFormFeedback(''), 5000);
    }
  };

  return (
    <div className="container-fluid py-5" id="section7" style={{ backgroundColor: '#d9faff', marginTop: '40px' }}>
      <div className="row align-items-center justify-content-center">
        <div className="col-md-6 OL5 text-center mb-4 mb-md-0">
          <Image
            src="/images/queryimg.png"
            alt="Query Image"
            width={500}
            height={400}
            className="img-fluid"
          />
        </div>
        <div className="col-md-6 OR5 p-4">
          <p className="text-primary fw-bold mb-3" style={{ fontSize: '2.5vw', fontFamily: 'Gill Sans, Gill Sans MT, Calibri, Trebuchet MS, sans-serif' }}>Have any Queries</p>
          <p className="lead mb-4" style={{ fontSize: '1.5vw' }}>Feel free to reach out to us, We are 24x7 available for your help</p>

          <form id="userinfo" onSubmit={handleQuerySubmit}>
            <div className="mb-3">
              <input type="text" id="username" name="username" placeholder="Name" className="form-control form-control-lg" required />
            </div>
            <div className="mb-3">
              <input type="tel" id="phone" name="phone" placeholder="Phone Number" className="form-control form-control-lg" required />
            </div>
            <div className="mb-3">
              <input type="email" id="email" name="email" placeholder="Email" className="form-control form-control-lg" required />
            </div>
            <div className="mb-4">
              <textarea id="query" name="query" placeholder="Enter your query message" rows="5" className="form-control form-control-lg" required></textarea>
            </div>
            <button type="submit" className="btn btn-success rounded-pill px-5 py-3" disabled={loading}>
              {loading ? 'Sending...' : 'Send'}
            </button>
            {formFeedback && (
              <p className={`mt-3 ${formFeedback.includes('successfully') ? 'text-success' : 'text-danger'}`}>
                {formFeedback}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}