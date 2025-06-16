import React from 'react';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const ProductCard = ({ product }) => {
  return (
    <div className="group relative selection:overflow-hidden transition-all">
      {/* Image + overlay icons */}
      <div className="relative w-full h-44 bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />

        {/* Hover icons */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
          <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100">
            <AddShoppingCartOutlinedIcon className="text-gray-800" />
          </button>
          <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100">
            <VisibilityOutlinedIcon className="text-gray-800" />
          </button>
        </div>
      </div>

      {/* Product info */}
      <div className="p-3 text-center">
        <h4 className="text-gray-800 font-medium">{product.name}</h4>
        <p className="text-primary font-medium">
          {product.price.toLocaleString()}
          <span className="text-xs inline-block ml-1 relative -top-1 underline "> đ</span>
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
