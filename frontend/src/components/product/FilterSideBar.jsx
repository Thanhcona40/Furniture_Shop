import React, { useState, useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { PRICE_RANGES, CATEGORIES } from '../../constants';

const FilterSidebar = React.memo(({ onChange, filters, onFilterChange }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const isActive = useCallback((path) => currentPath === path, [currentPath]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);

  // Handle filter changes for search page
  const handleFilterChange = useCallback((key, value) => {
    onFilterChange?.({ [key]: value });
  }, [onFilterChange]);

  const handleBrandChange = useCallback((brand) => {
    setSelectedBrands(prev => {
      const updatedBrands = prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand];
      
      onChange?.({
        brands: updatedBrands,
        prices: selectedPrices
      });
      
      return updatedBrands;
    });
  }, [onChange, selectedPrices]);

  const handlePriceChange = useCallback((price) => {
    setSelectedPrices(prev => {
      const updatedPrices = prev.includes(price)
        ? prev.filter((p) => p !== price)
        : [...prev, price];
      
      onChange?.({
        brands: selectedBrands,
        prices: updatedPrices
      });
      
      return updatedPrices;
    });
  }, [onChange, selectedBrands]);

  const handleCategoryClick = useCallback((category) => {
    navigate(`/allproducts?category=${encodeURIComponent(category)}`);
  }, [navigate]);

  const toggleDropdown = useCallback(() => {
    setShowDropdown(prev => !prev);
  }, []);

  // If this is for search page, render search-specific filters
  if (filters && onFilterChange) {
    return (
      <div className="space-y-6">
        <div>
          <div className="mb-4 relative">
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-200 z-0" />
            <h3 className="relative z-10 inline-block bg-primary text-white font-bold px-4 py-1 skew-x-[-12deg]">
              <span className="inline-block skew-x-[12deg]">BỘ LỌC TÌM KIẾM</span>
            </h3>
          </div>

          {/* Category Filter */}
          <div className="border border-primary p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Danh mục</h4>
            <select
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
            >
              <option value="">Tất cả danh mục</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="border border-primary p-4 rounded-lg mt-4">
            <h4 className="font-semibold mb-3">Khoảng giá</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Giá từ</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Giá đến</label>
                <input
                  type="number"
                  placeholder="Không giới hạn"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Sort Filter */}
          <div className="border border-primary p-4 rounded-lg mt-4">
            <h4 className="font-semibold mb-3">Sắp xếp</h4>
            <select
              value={filters.sortBy || 'name'}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
            >
              <option value="name">Tên A-Z</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  // Original filter sidebar for product list page
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-4 relative">
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-200 z-0" />
          <h3 className="relative z-10 inline-block bg-primary text-white font-bold px-4 py-1 skew-x-[-12deg]">
            <span className="inline-block skew-x-[12deg]">DANH MỤC</span>
          </h3>
        </div>

        <div className="flex flex-col space-y-2 border border-primary p-4 rounded-lg text-sm items-start">
          <Link to="/" className={isActive("/") ? "text-primary font-semibold" : "text-black"}>
            TRANG CHỦ
          </Link>

          <Link to="/about" className={isActive("/about") ? "text-primary font-semibold" : "text-black"}>
            GIỚI THIỆU
          </Link>

          {/* Dropdown inline */}
          <div className="w-full">
            <div
              className="flex items-center space-x-1 cursor-pointer"
            >
              <span className={isActive("/allproducts") ? "text-primary font-semibold" : "text-black"}>
                SẢN PHẨM
              </span>
              <ArrowDropDownOutlinedIcon
                onClick={toggleDropdown}
                className={`transition-transform duration-200 ${showDropdown ? "rotate-180" : "rotate-0"}`}
              />
            </div>

            {showDropdown && (
              <div className="mt-2 ml-4 space-y-1 flex flex-col">
                {CATEGORIES.map((item) => (
                  <span
                    key={item}
                    className="px-2 py-1 text-sm text-black hover:text-primary cursor-pointer"
                    onClick={() => handleCategoryClick(item)}
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>

          <Link to="/blog" className={isActive("/blog") ? "text-primary font-semibold" : "text-black"}>
            TIN TỨC
          </Link>

          <Link to="/contact" className={isActive("/contact") ? "text-primary font-semibold" : "text-black"}>
            LIÊN HỆ
          </Link>
        </div>
      </div>

      <div>
        <div className="relative mb-4">
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-200 z-0"></div>
          <h3 className="relative z-10 inline-block bg-primary text-white text-xl font-normal px-4 py-2 skew-x-[-12deg]">
            <span className="inline-block skew-x-[12deg]">KHOẢNG GIÁ</span>
          </h3>
        </div>

        <div className="border border-primary p-2 rounded-lg">
          {PRICE_RANGES.map((p) => (
            <label key={p.value} className="flex items-center gap-2 p-3 cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                className="appearance-none w-4 h-4 rounded-full border border-gray-300 checked:bg-primary cursor-pointer"
                checked={selectedPrices.includes(p.value)}
                onChange={() => handlePriceChange(p.value)}
              />
              <p className='text-sm'>{p.label}</p>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
});

FilterSidebar.displayName = 'FilterSidebar';

export default FilterSidebar;
