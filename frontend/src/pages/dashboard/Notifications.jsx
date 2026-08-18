import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../../services/notificationService';
import { Bell, Check, Trash2, CheckCheck } from 'lucide-react';
import { formatRelativeDate } from '../../utils/formatDate';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Toast from '../../components/ui/Toast';
import './Notifications.css';

const Notifications = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });

  const { data, isLoading, error } = useQuery({
    queryKey: ['notifications', { isRead: filter !== 'all' ? filter === 'unread' : undefined }],
    queryFn: () => notificationService.getAll({ 
      isRead: filter === 'unread' ? 'false' : filter === 'read' ? 'true' : undefined,
      limit: 50 
    }),
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      setToast({ isVisible: true, message: 'Notification marked as read', type: 'success' });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      setToast({ isVisible: true, message: 'All notifications marked as read', type: 'success' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => notificationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
      setToast({ isVisible: true, message: 'Notification deleted', type: 'success' });
    },
  });

  const notifications = data?.data || [];
  const unreadCount = data?.meta?.unreadCount || 0;

  const getNotificationIcon = (type) => {
    const icons = {
      appointment: '📅',
      payment: '💰',
      info: 'ℹ️',
      warning: '⚠️',
      success: '✅',
      error: '❌',
    };
    return icons[type] || '🔔';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">
            {unreadCount > 0 
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'You\'re all caught up!'
            }
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="secondary"
            onClick={() => markAllAsReadMutation.mutate()}
            isLoading={markAllAsReadMutation.isPending}
          >
            <CheckCheck size={18} />
            Mark All as Read
          </Button>
        )}
      </div>

      <div className="notification-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'filter-btn--active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'unread' ? 'filter-btn--active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread
          {unreadCount > 0 && <Badge variant="primary">{unreadCount}</Badge>}
        </button>
        <button
          className={`filter-btn ${filter === 'read' ? 'filter-btn--active' : ''}`}
          onClick={() => setFilter('read')}
        >
          Read
        </button>
      </div>

      {error && <div className="error-message">Failed to load notifications.</div>}

      {isLoading ? (
        <div className="loading-state">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="empty-state">
          <Bell size={48} />
          <h3>No notifications</h3>
          <p>You don't have any notifications yet.</p>
        </div>
      ) : (
        <div className="notification-list">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`notification-item ${!notification.isRead ? 'notification-item--unread' : ''}`}
            >
              <div className="notification-icon">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notification-content">
                <div className="notification-header">
                  <h4 className="notification-title">{notification.title}</h4>
                  <span className="notification-time">
                    {formatRelativeDate(notification.createdAt)}
                  </span>
                </div>
                <p className="notification-message">{notification.message}</p>
              </div>
              <div className="notification-actions">
                {!notification.isRead && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => markAsReadMutation.mutate(notification._id)}
                    isLoading={markAsReadMutation.isPending}
                  >
                    <Check size={16} />
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => deleteMutation.mutate(notification._id)}
                  isLoading={deleteMutation.isPending}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
};

export default Notifications;