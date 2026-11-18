import React, { useState } from 'react';
import { NotificationItem } from '../components/NotificationItem';
import { Button } from '../../../shared/components/ui/Button';
import { toast } from 'react-hot-toast';
import { Bell, CheckCheck } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: 'Recovery Plan Approved',
      message: 'Faruk Sir reviewed and approved your Monsoon Catch-Up Pathway with notes.',
      time: '2 hours ago',
      read: false,
      type: 'plan_approved',
    },
    {
      id: 'n2',
      title: 'New Diagnostic Quiz Available',
      message: 'A 5-question micro-check for Algebraic Polynomials is ready for you.',
      time: 'Yesterday',
      read: false,
      type: 'assessment_ready',
    },
    {
      id: 'n3',
      title: 'Peer Resource Shared',
      message: 'Farhan shared handwritten notes on Newtonian Physics in the library.',
      time: '3 days ago',
      read: true,
      type: 'resource_shared',
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read.');
  };

  const handleMarkSingle = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-bold text-matti">
            Notifications & Alerts
          </h1>
          <p className="text-sm text-matti-light mt-1">
            Real-time updates on teacher approvals, assessments, and peer study materials.
          </p>
        </div>

        <Button onClick={handleMarkAllRead} variant="outline" size="sm">
          <CheckCheck className="w-4 h-4 mr-1.5" />
          Mark All Read
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <NotificationItem
            key={notif.id}
            {...notif}
            onMarkRead={handleMarkSingle}
          />
        ))}
      </div>
    </div>
  );
};
