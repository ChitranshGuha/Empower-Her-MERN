// components/layout/FooterSection.jsx
import Image from "next/image";
import Link from "next/link"; // If needed for other links later

export default function FooterSection() {
  return (
    // Using Bootstrap utilities for background, text color, spacing, and flex layout
    <footer className="container-fluid bg-dark text-white py-5 px-4" id="section8">
      <div className="row justify-content-center align-items-start">
        <div className="col-md-4 col-lg-3 text-center text-md-start mb-4 mb-md-0">
          <a href="https://www.google.com/maps/search/23,+Sir+M.+Visvesvaraya+Marg,+Vallabh+Nagar,+Indore,+Madhya+Pradesh+452003" target="_blank" rel="noopener noreferrer" className="d-inline-block mb-2">
            <Image src="/images/location.png" alt="location" width={50} height={50} className="img-fluid" />
          </a>
          <p className="small">
            23, Sir M. Visvesvaraya Marg, Vallabh Nagar, Indore, Madhya Pradesh 452003 (click icon to reach us)
          </p>
        </div>
        <div className="col-md-4 col-lg-6 d-none d-md-block"> {/* MEOF equivalent, hidden on small screens */}
          {/* This column is effectively a spacer */}
        </div>
        <div className="col-md-4 col-lg-3 text-center text-md-end">
          <p className="mb-2">+91 12345567890</p>
          <p className="mb-0">contact@empowerher.com</p>
          {/* Social Icons - Add them here if you have them */}
          <div className="mt-3">
            <a href="#" className="me-3 social-icon"><Image src="/images/linkedin.png" alt="Social" width={30} height={30} /></a>
            <a href="#" className="social-icon"><Image src="/images/whatsapp.png" alt="Social" width={30} height={30} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}