import React, { useEffect, useState } from 'react';
import { getDashboardChartData } from '../../../api/dashboard';
import { LineChart } from '@mui/x-charts/LineChart';

const DashboardChart = () => {
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const data = await getDashboardChartData();
        setChartData(data);
      } catch (error) {
        setChartData([]);
      } finally {
        setChartLoading(false);
      }
    };
    fetchChartData();
  }, []);

  return (
    <div className="bg-white rounded shadow p-4 mb-8">
      <div className="font-semibold mb-2">Biểu đồ doanh thu & số lượng đơn hàng theo ngày</div>
      {chartLoading ? (
        <div>Đang tải biểu đồ...</div>
      ) : (
        <LineChart
          height={350}
          series={[
            {
              data: chartData.map(d => d.revenue),
              label: 'Doanh thu (VND)',
              yAxisKey: 'left',
              color: '#1976d2',
            },
            {
              data: chartData.map(d => d.orders),
              label: 'Số lượng đơn',
              yAxisKey: 'right',
              color: '#ff9800',
            },
          ]}
          xAxis={[{
            scaleType: 'point',
            data: chartData.map(d => d.date.slice(-2)),
            label: 'Ngày',
          }]}
          yAxis={[
            { id: 'left', label: 'Doanh thu (VND)', color: '#1976d2' },
            { id: 'right', label: 'Số lượng đơn', color: '#ff9800' },
          ]}
          leftAxis="left"
          rightAxis="right"
        />
      )}
    </div>
  );
};

export default DashboardChart; 