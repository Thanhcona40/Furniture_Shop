import React, { useState } from 'react';
import ProductCard from '../components/product/ProductCard';
import products from '../components/product/product';
import CategoryMenu from '../layouts/CategoryMenu';
import FilterSidebar from '../components/product/FilterSideBar';

const ProductListPage = () => {
  const [filter, setFilter] = useState({ brands: [], prices: []});
  const [type, setType] = useState("Tất cả sản phẩm");
  const currentProducts = products.filter((product) => {
    return type === "Tất cả sản phẩm" || product.type === type;
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
    return (
        <div className="relative max-w-[1110px] mx-auto mb-5"> {/* giống với CategoryMenu */}
            {/* Category Menu nằm ở trên, căn giữa theo 1200px */}
            <div className="absolute left-1/2 -translate-x-1/2 -top-20 flex w-max text-center z-10 bg-white">
                <CategoryMenu setType={setType}/>
            </div>
            <div className="flex gap-6 pt-32">
            {/* Nội dung chính bên dưới */}
            <div className="w-1/4">
                <FilterSidebar setType={setType} onChange={setFilter} />
            </div>
            <div className="w-3/4">
                <h1 className="text-2xl font-bold mb-4">{type}</h1>
                <div className="grid grid-cols-4 gap-4">
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
