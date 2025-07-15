import React, { useEffect, useState } from 'react';
import { getDashboardChartData } from '../../../api/dashboard';
import { LineChart } from '@mui/x-charts/LineChart';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const MONTHS = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

const DashboardChart = () => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth()); // 0-based
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'year'
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      setChartLoading(true);
      try {
        // Gọi API với params tháng/năm hoặc năm nếu viewMode là 'year'
        let data;
        if (viewMode === 'month') {
          data = await getDashboardChartData({ month: selectedMonth + 1, year: selectedYear });
        } else {
          data = await getDashboardChartData({ year: selectedYear });
        }
        setChartData(data);
      } catch (error) {
        setChartData([]);
      } finally {
        setChartLoading(false);
      }
    };
    fetchChartData();
  }, [selectedMonth, selectedYear, viewMode]);

  // Xử lý chuyển tháng
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(y => y - 1);
    } else {
      setSelectedMonth(m => m - 1);
    }
  };
  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(y => y + 1);
    } else {
      setSelectedMonth(m => m + 1);
    }
  };

  // Xử lý dữ liệu cho biểu đồ
  let series = [];
  let xAxis = [];
  let displayData = chartData;
  if (viewMode === 'year') {
    // Tổng hợp dữ liệu từng ngày thành 12 tháng
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({ revenue: 0, orders: 0 }));
    chartData.forEach(d => {
      const month = new Date(d.date).getMonth(); // 0-based
      monthlyData[month].revenue += d.revenue;
      monthlyData[month].orders += d.orders;
    });
    displayData = monthlyData;
  }
  if (viewMode === 'month') {
    // Giữ nguyên từng ngày
    displayData = chartData;
  }
  if (viewMode === 'month') {
    series = [
      {
        data: displayData.map(d => d.revenue),
        label: 'Doanh thu (VND)',
        yAxisKey: 'left',
        color: '#1976d2',
      },
      {
        data: displayData.map(d => d.orders),
        label: 'Số lượng đơn',
        yAxisKey: 'right',
        color: '#ff9800',
      },
    ];
    xAxis = [{
      scaleType: 'point',
      data: displayData.map(d => d.date.slice(-2)),
      label: 'Ngày',
    }];
  } else {
    // viewMode === 'year', mỗi điểm là 1 tháng
    series = [
      {
        data: displayData.map(d => d.revenue),
        label: 'Doanh thu (VND)',
        yAxisKey: 'left',
        color: '#1976d2',
      },
      {
        data: displayData.map(d => d.orders),
        label: 'Số lượng đơn',
        yAxisKey: 'right',
        color: '#ff9800',
      },
    ];
    xAxis = [{
      scaleType: 'point',
      data: MONTHS,
      label: 'Tháng',
    }];
  }

  return (
    <div className="bg-white rounded shadow p-4 mb-8">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">Biểu đồ doanh thu & số lượng đơn hàng</div>
        <div className="flex items-center gap-2">
          <Select
            value={viewMode}
            onChange={e => setViewMode(e.target.value)}
            size="small"
          >
            <MenuItem value="month">Xem theo ngày trong tháng</MenuItem>
            <MenuItem value="year">Xem theo tháng trong năm</MenuItem>
          </Select>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mb-4">
        {viewMode === 'month' && (
          <>
            <IconButton onClick={handlePrevMonth} size="small"><ArrowBackIosNewIcon fontSize="small" /></IconButton>
            <span className="font-medium">{`Tháng ${selectedMonth + 1}/${selectedYear}`}</span>
            <IconButton onClick={handleNextMonth} size="small"><ArrowForwardIosIcon fontSize="small" /></IconButton>
          </>
        )}
        {viewMode === 'year' && (
          <span className="font-medium">Năm {selectedYear}</span>
        )}
      </div>
      {chartLoading ? (
        <div>Đang tải biểu đồ...</div>
      ) : (
        <LineChart
          height={350}
          series={series}
          xAxis={xAxis}
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