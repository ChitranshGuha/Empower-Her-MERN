// components/sections/CentralContentSection.jsx
import Link from "next/link";

export default function CentralContentSection() {
  return (
    // Using Bootstrap container and row for layout
    <div className="container-fluid py-3" style={{ backgroundImage: 'url("/ch2.jpeg")', backgroundSize: 'cover', backgroundPosition: 'center', marginTop: '1%' }}>
      <div className="row justify-content-around gy-4"> {/* gy-4 adds vertical gutter for small screens */}
        <div className="col-md-5 d-flex flex-column justify-content-center align-items-center p-4 rounded shadow-lg bg-info bg-opacity-75"> {/* Using Bootstrap bg-info for light blue, bg-opacity for transparency */}
          <h2 className="mb-3 text-center" style={{ fontFamily: 'Georgia, serif' }}>Empower Women to Succeed</h2>
          <p className="lead text-center mb-4" style={{ fontFamily: 'Georgia, serif' }}>We help women find opportunities that match their skills. Join us today!</p>
          <Link href="/contact" className="btn btn-dark rounded-pill mb-3">Contact Us</Link>
          <a
            href="https://pib.gov.in/PressReleasePage.aspx?PRID=1947403#:~:text=The%20Ministry%20of%20Minority%20Affairs,were%20earmarked%20for%20female%20trainees."
            className="text-primary text-decoration-none" // Bootstrap primary color and no underline
            target="_blank"
            rel="noopener noreferrer"
            onMouseOver={(e) => e.target.style.textDecoration = 'underline'} // Keep original hover effect
            onMouseOut={(e) => e.target.style.textDecoration = 'none'}
          >
            Learn more about skills
          </a>
        </div>

        <div className="col-md-5 d-flex flex-column justify-content-center align-items-center p-4 rounded shadow-lg bg-info bg-opacity-75">
          <h2 className="mb-3 text-center" style={{ fontFamily: 'Georgia, serif' }}>Join Our Community</h2>
          <p className="lead text-center mb-4" style={{ fontFamily: 'Georgia, serif' }}>Become a part of a network that uplifts women. Your journey starts here!</p>
          <Link href="/register" className="btn btn-dark rounded-pill mb-3" style={{ fontFamily: 'Georgia, serif' }}>Get Involved</Link>
          <a
            href="#"
            className="text-primary text-decoration-none"
            onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
            onMouseOut={(e) => e.target.style.textDecoration = 'none'}
          >
            Discover more
          </a>
        </div>
      </div>
    </div>
  );
}