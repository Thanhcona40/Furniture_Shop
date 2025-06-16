import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

const FilterSidebar = ({setType, onChange }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => currentPath === path;
   const [showDropdown, setShowDropdown] = useState(false);

  const [selectedBrands, setSelectedBrands] = React.useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);

  const handleBrandChange = (brand) => {
    let updatedBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(updatedBrands);
    onChange({ brands: updatedBrands, prices: selectedPrices });
  };

  const handlePriceChange = (price) => {
  let updatedPrices = selectedPrices.includes(price)
    ? selectedPrices.filter((p) => p !== price)
    : [...selectedPrices, price];
  setSelectedPrices(updatedPrices);
  onChange({ brands: selectedBrands, prices: updatedPrices });
};

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
              onClick={() => setType("Tất cả sản phẩm")}
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
                  <Link
                    key={index}
                    to={`/allproducts?${item}`}
                    className="px-2 py-1 text-sm text-black hover:text-primary cursor-pointer"
                    onClick={() => setType(item)}
                  >
                    {item}
                  </Link>
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
