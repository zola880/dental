import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  DollarSign, 
  Clock, 
  TrendingUp 
} from 'lucide-react';
import { reportService } from '../../services/reportService';
import { formatCurrency } from '../../utils/formatCurrency';
import StatCard from '../../components/layout/StatCard';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import './Dashboard.css';

const Dashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: reportService.getDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        Failed to load dashboard statistics. Please try again.
      </div>
    );
  }

  const stats = data?.data || {};

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back! Here's what's happening at your clinic today.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={Users}
          title="Total Patients"
          value={stats.totalPatients || 0}
          change="+12%"
          changeType="positive"
        />
        <StatCard
          icon={Calendar}
          title="Today's Appointments"
          value={stats.todayAppointments || 0}
          change="5 pending"
          changeType="neutral"
        />
        <StatCard
          icon={CheckCircle}
          title="Completed"
          value={stats.completedAppointments || 0}
          change="+8%"
          changeType="positive"
        />
        <StatCard
          icon={DollarSign}
          title="Monthly Revenue"
          value={formatCurrency(stats.monthlyRevenue || 0)}
          change="+15%"
          changeType="positive"
        />
        <StatCard
          icon={Clock}
          title="Upcoming"
          value={stats.upcomingAppointments || 0}
          change="Next 7 days"
          changeType="neutral"
        />
        <StatCard
          icon={TrendingUp}
          title="Pending Payments"
          value={formatCurrency(stats.pendingPayments || 0)}
          change="23 invoices"
          changeType="negative"
        />
      </div>

      <div className="dashboard-grid">
        <Card padding="lg" className="dashboard-card">
          <h3 className="dashboard-card__title">Quick Actions</h3>
          <div className="quick-actions">
            <button className="quick-action-btn">
              <Users size={20} />
              <span>New Patient</span>
            </button>
            <button className="quick-action-btn">
              <Calendar size={20} />
              <span>Schedule Appointment</span>
            </button>
            <button className="quick-action-btn">
              <DollarSign size={20} />
              <span>Create Invoice</span>
            </button>
          </div>
        </Card>

        <Card padding="lg" className="dashboard-card">
          <h3 className="dashboard-card__title">Recent Activity</h3>
          <div className="recent-activity">
            <p className="recent-activity__placeholder">
              Activity feed will be displayed here.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;