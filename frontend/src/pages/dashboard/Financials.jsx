import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportService } from '../../services/reportService';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle 
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import StatCard from '../../components/layout/StatCard';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import './Financials.css';

const Financials = () => {
  const [dateRange, setDateRange] = useState('this_month');

  const getDateRange = () => {
    const end = new Date();
    const start = new Date();

    switch (dateRange) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        break;
      case 'this_week':
        start.setDate(start.getDate() - 7);
        break;
      case 'this_month':
        start.setMonth(start.getMonth() - 1);
        break;
      case 'this_year':
        start.setFullYear(start.getFullYear() - 1);
        break;
      default:
        start.setMonth(start.getMonth() - 1);
    }

    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
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

  const summary = summaryData?.data || {};
  const revenue = revenueData?.data || [];

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
        <select
          className="date-range-select"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="today">Today</option>
          <option value="this_week">This Week</option>
          <option value="this_month">This Month</option>
          <option value="this_year">This Year</option>
        </select>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={TrendingUp}
          title="Total Revenue"
          value={formatCurrency(summary.totalRevenue || 0)}
          change={`${summary.paymentCount || 0} payments`}
          changeType="positive"
        />
        <StatCard
          icon={TrendingDown}
          title="Total Expenses"
          value={formatCurrency(summary.totalExpenses || 0)}
          change={`${summary.expenseCount || 0} expenses`}
          changeType="negative"
        />
        <StatCard
          icon={DollarSign}
          title="Net Income"
          value={formatCurrency(summary.netIncome || 0)}
          change={summary.netIncome >= 0 ? 'Profitable' : 'Loss'}
          changeType={summary.netIncome >= 0 ? 'positive' : 'negative'}
        />
        <StatCard
          icon={AlertCircle}
          title="Outstanding"
          value={formatCurrency(summary.outstandingAmount || 0)}
          change="Unpaid invoices"
          changeType="neutral"
        />
      </div>

      <div className="financials-grid">
        <Card padding="lg" className="financials-card">
          <h3 className="financials-card__title">Revenue by Service</h3>
          {revenueLoading ? (
            <LoadingSpinner />
          ) : revenue.length === 0 ? (
            <p className="financials-empty">No revenue data available for this period.</p>
          ) : (
            <div className="revenue-list">
              {revenue.slice(0, 10).map((item, idx) => (
                <div key={idx} className="revenue-item">
                  <div className="revenue-item__info">
                    <span className="revenue-item__name">{item.serviceName}</span>
                    <span className="revenue-item__count">{item.count} transactions</span>
                  </div>
                  <span className="revenue-item__amount">
                    {formatCurrency(item.totalRevenue)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card padding="lg" className="financials-card">
          <h3 className="financials-card__title">Financial Summary</h3>
          <div className="summary-list">
            <div className="summary-item">
              <span>Total Transactions</span>
              <span className="summary-value">
                {(summary.paymentCount || 0) + (summary.expenseCount || 0)}
              </span>
            </div>
            <div className="summary-item">
              <span>Average Payment</span>
              <span className="summary-value">
                {formatCurrency(
                  summary.paymentCount > 0 
                    ? summary.totalRevenue / summary.paymentCount 
                    : 0
                )}
              </span>
            </div>
            <div className="summary-item">
              <span>Profit Margin</span>
              <span className="summary-value">
                {summary.totalRevenue > 0 
                  ? `${((summary.netIncome / summary.totalRevenue) * 100).toFixed(1)}%`
                  : '0%'
                }
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Financials;