import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  DollarSign, TrendingUp, TrendingDown, AlertCircle, PieChart as PieChartIcon 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, Cell
} from 'recharts';
import { reportService } from '../../services/reportService';
import { formatCurrency } from '../../utils/formatCurrency';
import StatCard from '../../components/layout/StatCard';
import ChartCard from '../../components/ui/ChartCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import './Financials.css';

const COLORS = ['#2A9D8F', '#264653', '#E9C46A', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'];

const Financials = () => {
  const [dateRange, setDateRange] = useState('this_month');

  const getDateRange = () => {
    const end = new Date();
    const start = new Date();
    switch (dateRange) {
      case 'today': start.setHours(0, 0, 0, 0); break;
      case 'this_week': start.setDate(start.getDate() - 7); break;
      case 'this_month': start.setMonth(start.getMonth() - 1); break;
      case 'this_year': start.setFullYear(start.getFullYear() - 1); break;
      default: start.setMonth(start.getMonth() - 1);
    }
    return { startDate: start.toISOString(), endDate: end.toISOString() };
  };

  const { startDate, endDate } = getDateRange();

  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ['financial-summary', startDate, endDate],
    queryFn: () => reportService.getFinancialSummary(startDate, endDate),
  });

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['revenue-by-service', startDate, endDate],
    queryFn: () => reportService.getRevenueByService(startDate, endDate),
  });

  const { data: periodData, isLoading: periodLoading } = useQuery({
    queryKey: ['revenue-by-period', 'monthly'],
    queryFn: () => reportService.getRevenueByPeriod('monthly'),
  });

  const summary = summaryData?.data || {};
  const revenueByService = revenueData?.data?.revenue || [];
  const revenueByPeriod = periodData?.data?.revenue || [];

  const serviceChartData = revenueByService.slice(0, 6).map((item, index) => ({
    name: item.serviceName.length > 15 ? item.serviceName.substring(0, 15) + '...' : item.serviceName,
    value: item.totalRevenue,
    color: COLORS[index % COLORS.length]
  }));

  const periodChartData = revenueByPeriod.slice(0, 6).reverse().map(item => ({
    name: `${item._id.month}/${item._id.year}`,
    revenue: item.totalRevenue
  }));

  if (summaryLoading) {
    return (
      <div className="financials-loading">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="financials-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Financial Overview</h1>
          <p className="page-subtitle">Track revenue, expenses, and financial performance.</p>
        </div>
        <select className="date-range-select" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
          <option value="today">Today</option>
          <option value="this_week">This Week</option>
          <option value="this_month">This Month</option>
          <option value="this_year">This Year</option>
        </select>
      </div>

      <div className="stats-grid">
        <StatCard icon={TrendingUp} title="Total Revenue" value={formatCurrency(summary.totalRevenue || 0)} change={`${summary.paymentCount || 0} payments`} changeType="positive" />
        <StatCard icon={TrendingDown} title="Total Expenses" value={formatCurrency(summary.totalExpenses || 0)} change={`${summary.expenseCount || 0} expenses`} changeType="negative" />
        <StatCard icon={DollarSign} title="Net Income" value={formatCurrency(summary.netIncome || 0)} change={summary.netIncome >= 0 ? 'Profitable' : 'Loss'} changeType={summary.netIncome >= 0 ? 'positive' : 'negative'} />
        <StatCard icon={AlertCircle} title="Outstanding" value={formatCurrency(summary.outstandingAmount || 0)} change="Unpaid invoices" changeType="neutral" />
      </div>

      <div className="financials-grid">
        <ChartCard title="Revenue Trend" className="financials-chart">
          {periodLoading || periodChartData.length === 0 ? (
            <div className="chart-empty">No period data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={periodChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2A9D8F" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2A9D8F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                <Area type="monotone" dataKey="revenue" stroke="#2A9D8F" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Revenue by Service" className="financials-chart">
          {revenueLoading || serviceChartData.length === 0 ? (
            <div className="chart-empty">No service data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={serviceChartData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(value) => `$${value/1000}k`} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#374151' }} width={100} />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {serviceChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Financial Summary" className="financials-summary">
          <div className="summary-list">
            <div className="summary-item">
              <span>Total Transactions</span>
              <span className="summary-value">{(summary.paymentCount || 0) + (summary.expenseCount || 0)}</span>
            </div>
            <div className="summary-item">
              <span>Average Payment</span>
              <span className="summary-value">
                {formatCurrency(summary.paymentCount > 0 ? summary.totalRevenue / summary.paymentCount : 0)}
              </span>
            </div>
            <div className="summary-item">
              <span>Profit Margin</span>
              <span className="summary-value">
                {summary.totalRevenue > 0 ? `${((summary.netIncome / summary.totalRevenue) * 100).toFixed(1)}%` : '0%'}
              </span>
            </div>
            <div className="summary-item">
              <span>Expense Ratio</span>
              <span className="summary-value">
                {summary.totalRevenue > 0 ? `${((summary.totalExpenses / summary.totalRevenue) * 100).toFixed(1)}%` : '0%'}
              </span>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Financials;