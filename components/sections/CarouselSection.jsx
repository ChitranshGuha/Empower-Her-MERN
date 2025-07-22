// components/sections/CarouselSection.jsx
import Image from "next/image";
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function CarouselSection() {
  const carouselInnerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0); 
  return (
    <section className="container-fluid text-center py-5 bg-light rounded shadow mt-4">
      <h2 className="mb-4" style={{ fontFamily: 'Georgia, serif' }}>Our Satisfied Customers</h2>

      {/* Bootstrap Carousel Component */}
      <div id="customerCarousel" className="carousel slide carousel-dark" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#customerCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#customerCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#customerCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
          <button type="button" data-bs-target="#customerCarousel" data-bs-slide-to="3" aria-label="Slide 4"></button>
        </div>
        <div className="carousel-inner" ref={carouselInnerRef}>
          {/* Each carousel item goes here */}
          <div className="carousel-item active">
            <Image src="/images/review/1.png" alt="Customer 1" width={800} height={500} className="d-block w-100 mx-auto rounded shadow" style={{ maxHeight: '400px', objectFit: 'contain' }} />
          </div>
          <div className="carousel-item">
            <Image src="/images/review/2.png" alt="Customer 2" width={800} height={500} className="d-block w-100 mx-auto rounded shadow" style={{ maxHeight: '400px', objectFit: 'contain' }} />
          </div>
          <div className="carousel-item">
            <Image src="/images/review/3.png" alt="Customer 3" width={800} height={500} className="d-block w-100 mx-auto rounded shadow" style={{ maxHeight: '400px', objectFit: 'contain' }} />
          </div>
          <div className="carousel-item">
            <Image src="/images/review/4.png" alt="Customer 4" width={800} height={500} className="d-block w-100 mx-auto rounded shadow" style={{ maxHeight: '400px', objectFit: 'contain' }} />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#customerCarousel" data-bs-slide="prev">
          {/* Change color to white */}
          <ArrowLeft size={36} color="white" />
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#customerCarousel" data-bs-slide="next">
          {/* Change color to white */}
          <ArrowRight size={36} color="white" />
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </section>
  );
}