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

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get("category") || "Tất cả sản phẩm";

  useEffect(() => {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const response = await getProducts({page: page, limit: itemsPerPage});
          setProducts(response.data.products);
          setTotalPages(response.data.totalPages);
          console.log("Fetched Data", response.data);
          console.log("Total Pages:", response.data.totalPages);
        } catch (err) {
          toast.error(err?.response?.data?.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
  }, [page]);

  // Reset về trang 1 khi filter hoặc category thay đổi
  useEffect(() => {
    setPage(1);
  }, [filter, category]);

  const currentProducts = products.filter((product) => {
    return category === "Tất cả sản phẩm" || product.category_id?.name === category;
  });

  const filterProducts = () => {
    return currentProducts.filter((product) => {
      const brandMatch =
        filter.brands.length === 0 ||
        filter.brands.some((brand) => product.name.includes(brand));

      const price = Number(product.price);
      const priceMatch =
        filter.prices.length === 0 ||
        filter.prices.some((priceRange) => {
          switch (priceRange) {
            case "under-100":
              return price < 100000;
            case "100-200":
              return price >= 100000 && price <= 200000;
            case "200-300":
              return price >= 200000 && price <= 300000;
            case "300-500":
              return price >= 300000 && price <= 500000;
            case "500-1000":
              return price >= 500000 && price <= 1000000;
            case "over-1000":
              return price > 1000000;
            default:
              return false;
          }
        });

      return brandMatch && priceMatch;
    });
  };

  const filtered = filterProducts();

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div>Loading...</div>;

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
          <h1 className="text-2xl font-bold mb-4 ml-5">{category}</h1>
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
            {filtered.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;

