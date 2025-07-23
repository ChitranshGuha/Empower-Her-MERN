import React, { useState, useEffect, useCallback } from "react"; // Import useCallback
import Link from "next/link";
import { useUser } from "../context/UserContext";
import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: "700",
});

function NavBar() {
  const { user } = useUser();
  const router = useRouter();
  const { setUser } = useUser();
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0); // New state for unread count

  // Function to fetch unread notification count
  const fetchUnreadCount = useCallback(async () => {
    if (!user || !user._id) {
      setUnreadNotificationsCount(0); // Reset if no user or user ID
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
  }, [user]); // Dependency on user: re-fetch if user object changes

  useEffect(() => {
    fetchUnreadCount();
    // Optional: Poll for new notifications periodically
    const interval = setInterval(fetchUnreadCount, 15000); // Poll every 15 seconds
    return () => clearInterval(interval); // Clean up interval on unmount
  }, [fetchUnreadCount]); // Dependency on memoized fetchUnreadCount

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
    <nav
      style={{ backgroundColor: "#a6f3ff" }}
      className="navbar navbar-expand-lg"
    >
      <Head>
        {/*
          IMPORTANT: Do not load stylesheets using next/head here.
          If this is for Material Symbols Outlined, use @next/font/google in _app.js
          or import the CSS globally in _app.js.
          This line can cause warnings/errors as per previous discussions.
        */}
        {/* <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" /> */}
      </Head>

      <Link href="/" className="navbar-brand ml-2 d-flex align-items-center">
        <Image
          src="/images/mainlogo1.png"
          alt="Company Logo"
          width={50}
          height={50}
        />
        <span
          className={`ml-2 ${playfair.className}`}
          style={{ color: "#333", fontSize: "25px" }}
        >
          Empower Her
        </span>
      </Link>

      <div className="collapse navbar-collapse justify-content-end">
        <ul className="navbar-nav d-flex align-items-center">
          <li className="nav-item">
            <Link href="/feedback" className="nav-link">
              <Image
                src="/images/feedback.jpg"
                alt="Feedback"
                width={45}
                height={45}
              />
            </Link>
          </li>
          <li className="nav-item position-relative"> {/* Added position-relative for badge positioning */}
            <Link href="/notification" className="nav-link">
              <Image
                src={bellIconSrc} // Use conditional source
                alt="Notification"
                width={45}
                height={45}
              />
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
                data-toggle="dropdown" // Note: Bootstrap 5 uses data-bs-toggle="dropdown"
                href="#"
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
                  <span
                    className="material-symbols-outlined" // Ensure Material Symbols font is loaded globally (e.g., in _app.js)
                    style={{
                      fontSize: "32px",
                      marginRight: "4px",
                      transition: "transform 0.3s",
                    }}
                  >
                    account_circle
                  </span>
                )}
              </a>
              <div className="dropdown-menu dropdown-menu-right">
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
        .user-icon:hover span {
          transform: scale(1.2);
          color: #000;
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