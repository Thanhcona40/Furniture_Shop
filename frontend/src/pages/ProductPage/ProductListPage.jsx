import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/product/ProductCard';
import CategoryMenu from '../../layouts/CategoryMenu';
import FilterSidebar from '../../components/product/FilterSideBar';
import {toast} from 'react-toastify'
import { getProducts } from '../../api/product';
import { useLocation } from "react-router-dom";


const ProductListPage = () => {
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get("category") || "Tất cả sản phẩm";
    
    useEffect(() => {
        if (!products?.length) {
        const fetchProducts = async () => {
            try {
            const response = await getProducts();
            setProducts(response.data);
            setLoading(false);
            } catch (err) {
            toast.error(err?.response?.data?.message);
            setLoading(false);
            }
        };
        fetchProducts();
        } else {
        setLoading(false);
        }
    }, [products]);

  const [filter, setFilter] = useState({ brands: [], prices: []});
  const currentProducts = products.filter((product) => {
    return category === "Tất cả sản phẩm" || product.category_id?.name === category;
  })

  const filterProducts = () => {
    return currentProducts.filter((product) => {
      const brandMatch =
        filter.brands.length === 0 || filter.brands.some((brand) => product.name.includes(brand));

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
   if (loading) return <div>Loading...</div>;
    return (
        <div className="relative max-w-[1110px] mx-auto mb-5"> {/* giống với CategoryMenu */}
            {/* Category Menu nằm ở trên, căn giữa theo 1200px */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-20 flex w-max text-center z-10 bg-white">
                <CategoryMenu />
            </div>
            <div className="flex gap-6 pt-32">
            {/* Nội dung chính bên dưới */}
            <div className="w-1/4">
                <FilterSidebar onChange={setFilter} />
            </div>
            <div className="w-3/4">
                <h1 className="text-2xl font-bold mb-4 ml-5">{category}</h1>
                <div className="grid grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
                    {filterProducts().map((item) => (
                        <ProductCard key={item.id} product={item} />
                    ))}
                </div>
            </div>
            </div>
        </div>

    );
}

export default ProductListPage;
