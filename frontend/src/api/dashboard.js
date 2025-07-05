import {api} from '../config/api';

export const getDashboardSummary = async () => {
  const res = await api.get('/admin/dashboard/summary');
  return res.data;
};

export const getDashboardChartData = async () => {
  const res = await api.get('/admin/dashboard/chart-data');
  return res.data;
}; 