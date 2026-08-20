import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, Calendar, CheckCircle, DollarSign, Clock, TrendingUp,
  Activity, PieChart as PieChartIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell 
} from 'recharts';
import { reportService } from '../../services/reportService';
import { formatCurrency } from '../../utils/formatCurrency';
import StatCard from '../../components/layout/StatCard';
import ChartCard from '../../components/ui/ChartCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import './Dashboard.css';

const COLORS = ['#2A9D8F', '#264653', '#E9C46A', '#EF4444', '#10B981', '#3B82F6'];

const Dashboard = () => {
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: reportService.getDashboardStats,
  });

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['revenue-by-period', 'monthly'],
    queryFn: () => reportService.getRevenueByPeriod('monthly'),
  });

  const stats = statsData?.data || {};
  const revenueByPeriod = revenueData?.data?.revenue || [];

  // Format Recharts data
  const chartData = revenueByPeriod.slice(0, 6).reverse().map(item => ({
    name: `${item._id.month}/${item._id.year}`,
    revenue: item.totalRevenue,
  }));

  if (statsLoading) {
    return (
      <div className="dashboard-loading">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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
        <StatCard icon={Users} title="Total Patients" value={stats.totalPatients || 0} change="+12%" changeType="positive" />
        <StatCard icon={Calendar} title="Today's Appts" value={stats.todayAppointments || 0} change="Active" changeType="neutral" />
        <StatCard icon={CheckCircle} title="Completed" value={stats.completedAppointments || 0} change="+8%" changeType="positive" />
        <StatCard icon={DollarSign} title="Monthly Revenue" value={formatCurrency(stats.monthlyRevenue || 0)} change="+15%" changeType="positive" />
        <StatCard icon={Clock} title="Upcoming" value={stats.upcomingAppointments || 0} change="Next 7 days" changeType="neutral" />
        <StatCard icon={TrendingUp} title="Pending" value={formatCurrency(stats.pendingPayments || 0)} change="Unpaid" changeType="negative" />
      </div>

      <div className="dashboard-grid">
        <ChartCard title="Revenue Trend (Last 6 Months)" className="dashboard-chart">
          {revenueLoading || chartData.length === 0 ? (
            <div className="chart-empty">No revenue data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#2A9D8F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Quick Actions" className="dashboard-actions">
          <div className="quick-actions">
            <button className="quick-action-btn">
              <Users size={20} />
              <span>New Patient</span>
            </button>
            <button className="quick-action-btn">
              <Calendar size={20} />
              <span>Schedule Appt</span>
            </button>
            <button className="quick-action-btn">
              <DollarSign size={20} />
              <span>Create Invoice</span>
            </button>
            <button className="quick-action-btn">
              <Activity size={20} />
              <span>View Reports</span>
            </button>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;