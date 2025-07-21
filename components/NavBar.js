import React from 'react';
import Link from 'next/link';
import { useUser } from '../context/UserContext';
import Image from "next/image";
import { Playfair_Display } from 'next/font/google';
import AuthForm from '@/pages/AuthForm';
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: '700', // or '400', '600', etc.
});

function NavBar() {
  const { user } = useUser();

  const renderActionButton = () => {
    if (!user) return null;

    if (user.role === 'job-seeker') {
      return <Link href="/find-jobs" className="nav-link">Find Jobs</Link>;
    }

    if (user.role === 'job-provider') {
      return <Link href="/post-job" className="nav-link">Post Job</Link>;
    }

    return null;
  };

  return (
    <nav style={{backgroundColor: "#a6f3ff"}} className="navbar navbar-expand-lg">
      <Link href="/" className="navbar-brand ml-2"><Image 
          src="/images/mainlogo1.png" 
          alt="Company Logo" 
          width={50} 
          height={50} 
        />
        <span className={`ml-2 ${playfair.className}`} style={{ color: "#333", fontSize: "25px" }}>Empower Her</span></Link>
      <div className="collapse navbar-collapse justify-content-end">
        <ul className="navbar-nav d-flex align-items-center">
          <li className="nav-item">
            <Link href="/feedback" className="nav-link"><Image
                src="/images/feedback.jpg"
                alt="Feedback" 
                width={45} 
                height={45} 
            /></Link>
          </li>
          <li className="nav-item">
            <Link href="/notifications" className="nav-link"><Image
                src="/images/bellicon.png"
                alt="Feedback" 
                width={45} 
                height={45} 
            /></Link>
          </li>

          {renderActionButton()}

          {!user ? (
            <>
              <li className="nav-item">
                <Link href="/AuthForm?mode=login" className="nav-link btn btn-dark text-white px-4 mx-1" style={{ borderRadius: "20px" , backgroundColor: "black"}}>Login</Link>
              </li>
              <li className="nav-item">
                <Link href="/AuthForm?mode=signup" className="nav-link btn btn-dark text-white px-4 mx-1" style={{ borderRadius: "20px" , backgroundColor: "black"}}>Sign Up</Link>
              </li>
            </>
          ) : (
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#">
                <i className="fas fa-user"></i>
              </a>
              <div className="dropdown-menu dropdown-menu-right">
                <Link href="/profile" className="dropdown-item">Edit Profile</Link>
                <Link href="/logout" className="dropdown-item">Logout</Link>
              </div>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
