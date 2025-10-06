import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/product/ProductCard';
import CategoryMenu from '../../layouts/CategoryMenu';
import FilterSidebar from '../../components/product/FilterSideBar';
import { toast } from 'react-toastify';
import { getProducts } from '../../api/product';
import { useLocation } from "react-router-dom";
import Pagination from '@mui/material/Pagination';

const ProductListPage = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState({ brands: [], prices: [] });
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get("category");
  const searchQuery = params.get("search") || ''; // Get search from URL params

  // Fetch products với filters từ backend
  useEffect(() => {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          
          // Build query params
          const queryParams = {
            page: page,
            limit: itemsPerPage,
          };

          // Add category filter
          if (category) {
            queryParams.category = category;
          }

          // Add price range filter
          if (filter.prices && filter.prices.length > 0) {
            // Convert price ranges to min/max
            const priceRanges = filter.prices.map(range => {
              switch (range) {
                case "under-100": return { min: 0, max: 100000 };
                case "100-200": return { min: 100000, max: 200000 };
                case "200-300": return { min: 200000, max: 300000 };
                case "300-500": return { min: 300000, max: 500000 };
                case "500-1000": return { min: 500000, max: 1000000 };
                case "over-1000": return { min: 1000000, max: 99999999 };
                default: return null;
              }
            }).filter(Boolean);

            if (priceRanges.length > 0) {
              // Get the min of all mins and max of all maxs
              queryParams.minPrice = Math.min(...priceRanges.map(r => r.min));
              queryParams.maxPrice = Math.max(...priceRanges.map(r => r.max));
            }
          }

          // Add search query
          if (searchQuery && searchQuery.trim()) {
            queryParams.search = searchQuery.trim();
          }

          const response = await getProducts(queryParams);
          setProducts(response.data.products);
          setTotalPages(response.data.totalPages);
          setTotal(response.data.total);
        } catch (err) {
          const errorMessage = err?.response?.data?.message || 'Lỗi tải sản phẩm';
          toast.error(errorMessage);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
  }, [page, category, filter, searchQuery]); // Add searchQuery dependency

  // Reset về trang 1 khi category, filter hoặc search thay đổi
  useEffect(() => {
    setPage(1);
  }, [category, filter, searchQuery]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="flex justify-center items-center h-64">Đang tải sản phẩm...</div>;

  return (
    <div className="relative max-w-[1110px] mx-auto mb-5">
      <div className="absolute left-1/2 -translate-x-1/2 -top-20 flex w-max text-center z-10 bg-white">
        <CategoryMenu />
      </div>
      <div className="flex gap-6 pt-32">
        <div className="w-1/4">
          <FilterSidebar onChange={setFilter} />
        </div>
        <div className="w-3/4">
          <h1 className="text-2xl font-bold mb-4 ml-5">
            {category || "Tất cả sản phẩm"} 
            <span className="text-sm text-gray-500 ml-2">({total} sản phẩm)</span>
          </h1>
          {products.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              {searchQuery ? `Không tìm thấy sản phẩm nào cho "${searchQuery}"` : "Không tìm thấy sản phẩm nào"}
            </div>
          ) : (
            <>
              <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
                {products.map((item) => (
                  <ProductCard key={item._id} product={item} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;

