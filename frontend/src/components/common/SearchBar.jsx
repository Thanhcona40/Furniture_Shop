import { useState } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

const SearchBar = ({ value, onChange, placeholder = "Tìm kiếm sản phẩm...", className = "" }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`flex items-center border-2 rounded-lg transition-all ${
        isFocused ? 'border-primary shadow-sm' : 'border-gray-300'
      }`}>
        <SearchOutlinedIcon className="ml-3 text-gray-400" />
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 outline-none bg-transparent"
        />

        {value && (
          <button
            onClick={handleClear}
            className="mr-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            type="button"
          >
            <ClearOutlinedIcon className="text-gray-400 text-sm" />
          </button>
        )}
      </div>

      {value && (
        <div className="absolute top-full mt-1 text-xs text-gray-500">
          Đang tìm: "{value}"
        </div>
      )}
    </div>
  );
};

export default SearchBar;
