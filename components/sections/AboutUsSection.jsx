// components/sections/AboutUsSection.jsx
import Image from "next/image";

export default function AboutUsSection() {
  return (
    <div className="container-fluid about-container d-flex flex-column flex-md-row justify-content-center align-items-center py-5"
         style={{ backgroundImage: 'url("/images/backg.jpeg")', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '75vh', position: 'relative' }}>

      {/* Overlay for fade effect */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to right, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0))', zIndex: 1 }}></div>

      <div className="row w-100 justify-content-center align-items-center" style={{ zIndex: 2 }}>
        <div className="col-md-6 p-4 about-content text-dark">
          {/* Option 1: Use Bootstrap text-dark (or text-black) and fw-bold for heading */}
          <h2 className="mb-3 text-dark fw-bold" style={{ fontFamily: 'Georgia, serif', fontSize: '2.5em' }}>About Us</h2>
          {/* Option 2: Use Bootstrap text-dark (or text-black) and fw-semibold/fw-medium for paragraphs */}
          <p className="lead mb-3 text-dark fw-medium" style={{ fontFamily: 'Arial, sans-serif' }}>
            We are dedicated to empowering women through various initiatives and support systems. Our mission is to connect women with opportunities that enhance their skills and help them succeed in their careers. We believe in a world where every woman can thrive and achieve her full potential.
          </p>
          <p className="lead text-dark fw-medium" style={{ fontFamily: 'Arial, sans-serif' }}>
            Our approach involves community building, skill development, and providing resources that are tailored to women's unique needs. Join us and be part of a transformative journey!
          </p>
        </div>
        <div className="col-md-6 about-image">
          {/* This Image component is likely causing errors as discussed previously due to layout/objectFit.
              Assuming it's corrected to use `fill` or `width/height` directly.
              Also, ensure the src is correct: it should be `/images/backg.jpeg` if it's in public/images.
          */}
          <Image src="/images/backg.jpeg" alt="About Us" fill style={{ objectFit: 'cover' }} className="rounded shadow" />
        </div>
      </div>
    </div>
  );
}