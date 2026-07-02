import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dashboardService } from '../../services/api';
import StatCard from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';
import {
  Briefcase, Users, DollarSign, FileText, CheckCircle,
  AlertTriangle, TrendingUp, TrendingDown, Sun, Zap
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  AreaChart, Area
} from 'recharts';
import toast from 'react-hot-toast';

const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

const MainDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [projectStages, setProjectStages] = useState([]);
  const [leadFunnel, setLeadFunnel] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, revenueRes, stagesRes, funnelRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getMonthlyRevenue(new Date().getFullYear()),
        dashboardService.getProjectStages(),
        dashboardService.getLeadFunnel()
      ]);

      setStats(statsRes.data.data);
      setMonthlyRevenue(revenueRes.data.data || []);
      setProjectStages(stagesRes.data.data || []);
      setLeadFunnel(funnelRes.data.data || []);
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.name || 'User'}!</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Sun className="w-4 h-4" />
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Projects"
          value={stats?.projects?.total || 0}
          subtitle={`${stats?.projects?.active || 0} Active`}
          icon={Briefcase}
          color="primary"
          trend={12}
        />
        <StatCard
          title="Total Employees"
          value={stats?.employees?.total || 0}
          subtitle={`${stats?.employees?.active || 0} Active`}
          icon={Users}
          color="solar"
          trend={5}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${(stats?.financial?.totalRevenue || 0).toLocaleString('en-IN')}`}
          subtitle={`Net Profit: ₹${(stats?.financial?.netProfit || 0).toLocaleString('en-IN')}`}
          icon={DollarSign}
          color="green"
          trend={8}
        />
        <StatCard
          title="Invoices"
          value={stats?.invoices?.total || 0}
          subtitle={`${stats?.invoices?.overdue || 0} Overdue`}
          icon={FileText}
          color="blue"
          trend={-3}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue & Cost Chart */}
        <ChartCard title="Monthly Revenue & Costs" subtitle="Financial overview for current year">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="monthName" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`} />
              <Tooltip
                formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.2} />
              <Area type="monotone" dataKey="costs" name="Costs" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
              <Area type="monotone" dataKey="profit" name="Profit" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Project Stage Distribution */}
        <ChartCard title="Project Stage Distribution" subtitle="Current project pipeline">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectStages}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ _id, count }) => `${_id}: ${count}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {projectStages.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Funnel */}
        <ChartCard title="Lead Conversion Funnel" subtitle="Sales pipeline stages">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={leadFunnel} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="_id" type="category" tick={{ fontSize: 12 }} width={100} />
              <Tooltip
                formatter={(value, name) => [value, name === 'count' ? 'Count' : 'Value']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Bar dataKey="count" name="Lead Count" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
              <Bar dataKey="value" name="Estimated Value" fill="#22c55e" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Invoice Status */}
        <ChartCard title="Invoice Status Overview" subtitle="Payment collection status">
          <div className="space-y-4">
            {[
              { label: 'Paid', value: stats?.invoices?.paid || 0, total: stats?.invoices?.total || 1, color: 'bg-green-500' },
              { label: 'Overdue', value: stats?.invoices?.overdue || 0, total: stats?.invoices?.total || 1, color: 'bg-red-500' },
              { label: 'Pending', value: (stats?.invoices?.total || 0) - (stats?.invoices?.paid || 0) - (stats?.invoices?.overdue || 0), total: stats?.invoices?.total || 1, color: 'bg-yellow-500' },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  <span className="text-sm text-gray-500">{item.value} / {item.total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`${item.color} h-2.5 rounded-full transition-all duration-500`}
                    style={{ width: `${(item.value / item.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}

            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="bg-green-50 rounded-lg p-3">
                <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-green-700">{stats?.invoices?.paid || 0}</p>
                <p className="text-xs text-green-600">Paid</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-yellow-700">{stats?.invoices?.overdue || 0}</p>
                <p className="text-xs text-yellow-600">Overdue</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <FileText className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-blue-700">{stats?.invoices?.total || 0}</p>
                <p className="text-xs text-blue-600">Total</p>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8" />
            <div>
              <p className="text-primary-100 text-sm">Total PO Value</p>
              <p className="text-2xl font-bold">₹{(stats?.projects?.totalPOValue || 0).toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-solar-500 to-solar-600 text-white">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8" />
            <div>
              <p className="text-solar-100 text-sm">Won Leads</p>
              <p className="text-2xl font-bold">{stats?.leads?.won || 0} / {stats?.leads?.total || 0}</p>
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8" />
            <div>
              <p className="text-blue-100 text-sm">Completed Projects</p>
              <p className="text-2xl font-bold">{stats?.projects?.completed || 0}</p>
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <TrendingDown className="w-8 h-8" />
            <div>
              <p className="text-purple-100 text-sm">Total Costs</p>
              <p className="text-2xl font-bold">₹{(stats?.financial?.totalCosts || 0).toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
