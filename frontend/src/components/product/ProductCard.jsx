import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { addCartItem, initializeCart } from '../../redux/slices/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id: userId } = useSelector((state) => state.auth.user);
  const { cartId, status } = useSelector((state) => state.cart);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    if (!userId) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      return;
    }

    if (!cartId) {
      try {
        await dispatch(initializeCart(userId)).unwrap();
        // Cart will be initialized, but we need to wait for the next render cycle
        toast.info("Đang khởi tạo giỏ hàng, vui lòng thử lại!");
        return;
      } catch (error) {
        toast.error("Lỗi khởi tạo giỏ hàng!");
        return;
      }
    }

    // Get the first variant or use product default
    const firstVariant = product.variants?.[0];
    
    if (!firstVariant) {
      toast.error("Sản phẩm này không có biến thể!");
      return;
    }

    dispatch(
      addCartItem({
        cart_id: cartId,
        product_id: product._id,
        variant_id: firstVariant._id,
        quantity: 1,
      })
    );
    toast.success("Đã thêm vào giỏ hàng!");
  };

  const handleViewProduct = (e) => {
    e.stopPropagation();
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="group relative selection:overflow-hidden transition-all">
      {/* Image + overlay icons */}
      <div className="relative w-full h-44 bg-gray-100">
        <img
          src={product.thumbnail_url}
          alt={product.name}
          className="w-full h-full object-cover"
        />

        {/* Hover icons */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
          <button 
            onClick={handleAddToCart}
            className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
            disabled={status === "loading"}
          >
            <AddShoppingCartOutlinedIcon className="text-gray-800" />
          </button>
          <button 
            onClick={handleViewProduct}
            className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
          >
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
