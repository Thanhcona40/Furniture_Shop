import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import viLocale from 'date-fns/locale/vi';
import SortIcon from '@mui/icons-material/Sort';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const OrderFilterBar = ({
  searchInput,
  setSearchInput,
  handleSearch,
  dateFilter,
  setDateFilter,
  sortOrder,
  setSortOrder
}) => {
  const handleReset = (e) => {
    e.preventDefault();
    setSearchInput('');
    setDateFilter(null);
    setSortOrder('desc');
    handleSearch();
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col md:flex-row md:items-end gap-14 mb-4 bg-gray-50 p-4 rounded relative">
      <div className="flex flex-col">
        <label className="block text-sm font-medium mb-1">Tìm kiếm</label>
        <div className="flex items-center gap-2">
          <TextField
            variant="outlined"
            size="small"
            placeholder="Mã đơn hoặc tên khách hàng"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
            onKeyDown={e => { if (e.key === 'Enter') handleSearch(e); }}
          />
          <button
            className='bg-primary text-white px-4 py-2 rounded-md'
            onClick={handleSearch}
            type="submit"
          >
            Tìm kiếm
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Ngày</label>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
          <DatePicker
            label=""
            value={dateFilter}
            onChange={date => setDateFilter(date)}
            renderInput={(params) => <TextField {...params} size="small" sx={{ minWidth: 140 }} />}
          />
        </LocalizationProvider>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Sắp xếp</label>
        <Button
          variant="outlined"
          startIcon={<SortIcon style={{ transform: sortOrder === 'asc' ? 'rotate(180deg)' : 'none' }} />}
          onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
          size="small"
          sx={{ minWidth: 140 }}
        >
          {sortOrder === 'asc' ? 'Ngày tăng dần' : 'Ngày giảm dần'}
        </Button>
      </div>
      <button
        className="absolute right-4 bottom-4 text-gray-500 hover:text-primary transition"
        onClick={handleReset}
        type="button"
        title="Đặt lại bộ lọc"
      >
        <RestartAltIcon fontSize="medium" />
      </button>
    </form>
  );
};

export default OrderFilterBar; 