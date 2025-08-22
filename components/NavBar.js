import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useUser } from "../context/UserContext";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { User as UserIcon, Briefcase, MapPin, DollarSign, Calendar, Building2, Search, Filter } from 'lucide-react'; // Using UserIcon to avoid conflict with 'user' variable

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: "700",
});

function NavBar() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    if (!user || !user._id) {
      setUnreadNotificationsCount(0);
      return;
    }
    try {
      const res = await fetch(`/api/notifications/unread/${user._id}`);
      const data = await res.json();
      if (res.ok) {
        setUnreadNotificationsCount(data.count);
      } else {
        console.error('Failed to fetch unread notification count:', data.message);
        setUnreadNotificationsCount(0);
      }
    } catch (err) {
      console.error('Client-side error fetching unread count:', err);
      setUnreadNotificationsCount(0);
    }
  }, [user]);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 15000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  const renderActionButton = () => {
    if (!user) return null;

    if (user.role === "job-seeker") {
      return (
        <>
          <Link
            href="/find-jobs"
            className="nav-link btn btn-dark text-white px-4 mx-1"
            style={{ borderRadius: "20px", backgroundColor: "black" }}
          >
            Find Jobs
          </Link>
          <Link
            href="/applied-jobs"
            className="nav-link btn btn-dark text-white px-4 mx-1"
            style={{ borderRadius: "20px", backgroundColor: "black" }}
          >
            Applied Jobs
          </Link>
        </>
      );
    }

    if (user.role === "job-provider") {
      return (
        <>
          <Link
            href="/posted-job"
            className="nav-link btn btn-dark text-white px-4 mx-1"
            style={{ borderRadius: "20px", backgroundColor: "black" }}
          >
            Posted Job
          </Link>
          <Link
            href="/post-job"
            className="nav-link btn btn-dark text-white px-4 mx-1"
            style={{ borderRadius: "20px", backgroundColor: "black" }}
          >
            Post Job
          </Link>
        </>
      );
    }
    return null;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/AuthForm?mode=login");
  };

  const bellIconSrc = unreadNotificationsCount > 0 ? "/images/belliconUpdate.png" : "/images/bellicon.png";

  return (
    <nav style={{ backgroundColor: "#a6f3ff" }} className="navbar navbar-expand-lg">
      <Head>
      </Head>

      <Link href="/" className="navbar-brand ml-2 d-flex align-items-center">
        <Image src="/images/mainlogo1.png" alt="Company Logo" width={50} height={50} />
        <span className={`ml-2 ${playfair.className}`} style={{ color: "#333", fontSize: "25px" }}>
          Empower Her
        </span>
      </Link>

      <div className="collapse navbar-collapse justify-content-end">
        <ul className="navbar-nav d-flex align-items-center">
          <li className="nav-item">
            <Link href="/feedback" className="nav-link">
              <Image src="/images/feedback.jpg" alt="Feedback" width={45} height={45} />
            </Link>
          </li>
          <li className="nav-item position-relative">
            <Link href="/notification" className="nav-link">
              <Image src={bellIconSrc} alt="Notification" width={45} height={45} />
              {unreadNotificationsCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {unreadNotificationsCount}
                  <span className="visually-hidden">unread messages</span>
                </span>
              )}
            </Link>
          </li>

          {renderActionButton()}

          {!user ? (
            <>
              <li className="nav-item">
                <Link
                  href="/AuthForm?mode=login"
                  className="nav-link btn btn-dark text-white px-4 mx-1"
                  style={{ borderRadius: "20px", backgroundColor: "black" }}
                >
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/AuthForm?mode=signup"
                  className="nav-link btn btn-dark text-white px-4 mx-1"
                  style={{ borderRadius: "20px", backgroundColor: "black" }}
                >
                  Sign Up
                </Link>
              </li>
            </>
          ) : (
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center user-icon"
                data-bs-toggle="dropdown" 
                href="#"
                role="button"
                aria-expanded="false" 
                style={{ cursor: "pointer" }}
              >
                {user.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt="User Avatar"
                    width={36}
                    height={36}
                    className="rounded-circle user-avatar"
                  />
                ) : (
                  <UserIcon 
                    size={32}
                    className="me-1"
                    style={{
                      transition: "transform 0.3s",
                      color: "#333" 
                    }}
                  />
                )}
              </a>
              <div className="dropdown-menu dropdown-menu-end">
                <Link href="/profile" className="dropdown-item">
                  Edit Profile
                </Link>
                <button onClick={logout} className="dropdown-item">
                  Logout
                </button>
              </div>
            </li>
          )}
        </ul>
      </div>

      <style jsx>{`
        .user-icon:hover span { /* This applies to the old Material Symbols icon */
          transform: scale(1.2);
          color: #000;
        }
        .user-icon:hover svg { /* New rule for Lucide SVG icon */
          transform: scale(1.2);
          color: #000; /* Adjust hover color if needed */
        }
        .user-avatar:hover {
          transform: scale(1.1);
        }
        .user-avatar {
          transition: transform 0.3s;
        }
      `}</style>
    </nav>
  );
}

export default NavBar;