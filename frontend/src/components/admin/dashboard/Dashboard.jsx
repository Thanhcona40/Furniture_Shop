import React, { useEffect, useState } from 'react';
import { getDashboardSummary } from '../../../api/dashboard';
import RecentOrdersTable from './RecentOrdersTable';
import BestSellingProductsTable from './BestSellingProductsTable';
import StatCard from './StatCard';
import DashboardChart from './DashboardChart';
import CircularProgress from '@mui/material/CircularProgress';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getDashboardSummary();
        setSummary(data);
      } catch (error) {
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return  <div className="flex justify-center items-center h-screen"><CircularProgress /></div>;
  if (!summary) return <div className="p-6 ml-64">Không thể tải dữ liệu dashboard.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Tổng đơn hàng" value={summary.totalOrders} />
        <StatCard label="Tổng doanh thu" value={summary.totalRevenue.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})} />
        <StatCard label="Khách mới trong tháng" value={summary.newCustomers} />
        <StatCard label="Tồn kho" value={summary.productsInStock} infoDetail={{ lowStockProducts: summary.lowStockProducts, outOfStockProducts: summary.outOfStockProducts }} />
      </div>
      <DashboardChart />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentOrdersTable orders={summary.recentOrders} />
        <BestSellingProductsTable products={summary.bestSellingProducts} />
      </div>
    </div>
  );
};

export default Dashboard;