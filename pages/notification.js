import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import NavBar from '@/components/NavBar';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';
import {
  Bell, Mail, CheckCircle, PlusCircle, AlertCircle, RefreshCcw, Building2
} from 'lucide-react';

const NotificationsPage = () => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user || !user._id) {
      setLoading(false);
      setNotifications([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/notifications/${user._id}`);
      const data = await res.json();

      if (res.ok) {
        setNotifications(data.data);
      } else {
        setError(data.message || 'Failed to fetch notifications.');
        setNotifications([]);
      }
    } catch (err) {
      setError('An error occurred while connecting to the server. Please check your network.');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (notificationId) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/notifications/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: [notificationId] }),
      });

      if (res.ok) {
        setNotifications(prevNotifs =>
          prevNotifs.map(notif =>
            notif._id === notificationId ? { ...notif, isRead: true } : notif
          )
        );
      } else {
        alert('Failed to mark as read: ' + (await res.json()).message);
      }
    } catch (err) {
      alert('An error occurred while marking notification as read.');
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (notifications.filter(n => !n.isRead).length === 0) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/notifications/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllAsRead: true }),
      });

      if (res.ok) {
        setNotifications(prevNotifs =>
          prevNotifs.map(notif => ({ ...notif, isRead: true }))
        );
      } else {
        alert('Failed to mark all as read: ' + (await res.json()).message);
      }
    } catch (err) {
      alert('An error occurred while marking all notifications as read.');
    } finally {
      setUpdating(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application_status_update': return <CheckCircle size={20} className="text-success me-2" />;
      case 'new_applicant': return <PlusCircle size={20} className="text-primary me-2" />;
      case 'general_message': return <Mail size={20} className="text-info me-2" />;
      default: return <Bell size={20} className="text-muted me-2" />;
    }
  };

  if (!user) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="bg-white p-5 rounded-4 shadow-lg text-center" style={{ maxWidth: "400px" }}>
          <div className="d-flex align-items-center justify-content-center mx-auto mb-4 rounded-circle bg-danger bg-opacity-10" style={{ width: "64px", height: "64px" }}>
            <Building2 className="text-danger" size={32} />
          </div>
          <h2 className="h3 fw-bold text-dark mb-3">Access Denied</h2>
          <p className="text-muted">Please log in to view your notifications.</p>
          <p className="text-muted">You can log in or sign up <Link href="/AuthForm?mode=login">here</Link>.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Notifications | Empower Her</title>
        <link rel="icon" href="/images/mainlogo1.png" type="image/png" />
      </Head>

      <NavBar />
      <div className="container py-5">
        <h1 className="text-center mb-5 fw-bold text-primary">Your Notifications</h1>

        <div className="d-flex justify-content-end mb-4">
          <button className="btn btn-outline-secondary me-2" onClick={fetchNotifications} disabled={loading || updating}>
            <RefreshCcw size={18} className="me-2" /> Refresh
          </button>
          <button
            className="btn btn-primary"
            onClick={handleMarkAllAsRead}
            disabled={loading || updating || notifications.filter(n => !n.isRead).length === 0}
          >
            <CheckCircle size={18} className="me-2" /> Mark All as Read
          </button>
        </div>

        {loading && (
          <div className="d-flex justify-content-center align-items-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading notifications...</span>
            </div>
            <p className="ms-3 text-muted">Loading your notifications...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        {!loading && notifications.length === 0 && !error && (
          <div className="alert alert-info text-center" role="alert">
            You have no notifications yet.
          </div>
        )}

        <div className="list-group">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`list-group-item list-group-item-action ${!notification.isRead ? 'list-group-item-light fw-bold' : 'text-muted'} mb-2 rounded-3 shadow-sm p-3 d-flex align-items-start`}
            >
              {getNotificationIcon(notification.type)}
              <div className="flex-grow-1">
                <div className="d-flex w-100 justify-content-between">
                  <h6 className="mb-1 text-capitalize">
                    {notification.type.replace(/_/g, ' ')}
                  </h6>
                  <small className="text-muted">
                    {new Date(notification.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
                  </small>
                </div>
                <p className={`mb-1 ${!notification.isRead ? 'text-dark' : 'text-muted'}`}>{notification.message}</p>
                {notification.relatedEntity && notification.relatedEntityType && (
                  <Link
                    href={`/${notification.relatedEntityType.toLowerCase() === 'application' ? 'applied-jobs' : 'job'}/${notification.relatedEntity}`}
                    className="small text-primary text-decoration-none"
                  >
                    View Details
                  </Link>
                )}
              </div>
              {!notification.isRead && (
                <button
                  className="btn btn-sm btn-outline-secondary ms-3 flex-shrink-0"
                  onClick={() => handleMarkAsRead(notification._id)}
                  disabled={updating}
                  title="Mark as Read"
                >
                  <CheckCircle size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NotificationsPage;
