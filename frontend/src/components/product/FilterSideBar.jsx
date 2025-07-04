import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';

const brands = ["Luxury", "Woody", "Euro", "Hobu","Poplar", "Tabu","Miso"];
const prices = [
  { label: "Dưới 100.000₫", value: "under-100" },
  { label: "100.000₫ - 200.000₫", value: "100-200" },
  { label: "200.000₫ - 300.000₫", value: "200-300" },
  { label: "300.000₫ - 500.000₫", value: "300-500" },
  { label: "500.000₫ - 1.000.000₫", value: "500-1000" },
  { label: "Trên 1.000.000₫", value: "over-1000" },
];

const FilterSidebar = ({ onChange, filters, onFilterChange }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const isActive = (path) => currentPath === path;
  const [showDropdown, setShowDropdown] = useState(false);

  const [selectedBrands, setSelectedBrands] = React.useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);

  // Handle filter changes for search page
  const handleFilterChange = (key, value) => {
    if (onFilterChange) {
      onFilterChange({ [key]: value });
    }
  };

  const handleBrandChange = (brand) => {
    let updatedBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(updatedBrands);
    if (onChange) {
      onChange({ brands: updatedBrands, prices: selectedPrices });
    }
  };

  const handlePriceChange = (price) => {
    let updatedPrices = selectedPrices.includes(price)
      ? selectedPrices.filter((p) => p !== price)
      : [...selectedPrices, price];
    setSelectedPrices(updatedPrices);
    if (onChange) {
      onChange({ brands: selectedBrands, prices: updatedPrices });
    }
  };

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
              <option value="Sofa">Sofa</option>
              <option value="Ghế">Ghế</option>
              <option value="Trang trí">Trang trí</option>
              <option value="Kệ sách">Kệ sách</option>
              <option value="Bàn">Bàn</option>
              <option value="Tủ quần áo">Tủ quần áo</option>
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
                onClick={() => setShowDropdown(!showDropdown)}
                className={`transition-transform duration-200 ${showDropdown ? "rotate-180" : "rotate-0"}`}
              />
            </div>

            {showDropdown && (
              <div className="mt-2 ml-4 space-y-1 flex flex-col">
                {["Sofa", "Ghế", "Trang trí", "Kệ sách", "Bàn", "Tủ quần áo"].map((item, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-sm text-black hover:text-primary cursor-pointer"
                    onClick={() => navigate(`/allproducts?category=${encodeURIComponent(item)}`)}
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
            <span className="inline-block skew-x-[12deg]">THƯƠNG HIỆU</span>
          </h3>
        </div>

        <div className="border border-primary p-2 rounded-lg">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer p-3">
              <input
                type="checkbox"
                className="appearance-none w-4 h-4 rounded-full border border-gray-300  checked:bg-primary"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
              />
              <p className='text-sm'>{brand}</p>
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="relative mb-4">
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-200 z-0"></div>
          <h3 className="relative z-10 inline-block bg-primary text-white text-xl font-normal px-4 py-2 skew-x-[-12deg]">
            <span className="inline-block skew-x-[12deg]">KHOẢNG GIÁ</span>
          </h3>
        </div>

        <div className=" border border-primary p-2 rounded-lg">
          {prices.map((p) => (
            <label key={p.value} className="flex items-center gap-2 p-3 cursor-pointer">
              <input
                type="checkbox"
                className="appearance-none w-4 h-4 rounded-full border border-gray-300 checked:bg-primary"
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
};

export default FilterSidebar;
