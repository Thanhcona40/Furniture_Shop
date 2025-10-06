import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { OptimizedImage } from '../common';
import { addCartItem, initializeCart } from '../../redux/actions/cartActions';

const ProductCard = React.memo(({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { cartId, status } = useSelector((state) => state.cart);

  const handleAddToCart = useCallback(async (e) => {
    e.stopPropagation();
    
    if (!user || !user._id) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      return;
    }

    try {
      // Nếu chưa có cartId, khởi tạo cart trước
      let currentCartId = cartId;
      if (!currentCartId) {
        currentCartId = await dispatch(initializeCart()).unwrap();
        console.log('Cart initialized with ID:', currentCartId);
      }
      const hasVariants = product.variants && product.variants.length > 0;
      
      let cartItemData;
      if (hasVariants) {
        const firstVariant = product.variants[0];
        cartItemData = {
          cart_id: currentCartId,
          product_id: product._id,
          variant_id: firstVariant._id,
          quantity: 1,
        };
      } else {
        cartItemData = {
          cart_id: currentCartId,
          product_id: product._id,
          quantity: 1,
        };
      }

      console.log('Adding to cart with data:', cartItemData);
      await dispatch(addCartItem(cartItemData)).unwrap();
      
      toast.success("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error?.message || "Lỗi thêm vào giỏ hàng!");
    }
  }, [user, cartId, dispatch, product]);

  const handleViewProduct = useCallback((e) => {
    e.stopPropagation();
    navigate(`/product/${product._id}`);
  }, [navigate, product._id]);

  // Memoize giá sản phẩm
  const displayPrice = useMemo(() => {
    if (product.variants && product.variants.length > 0) {
      return product.variants[0].price?.toLocaleString('vi-VN') || product.price?.toLocaleString('vi-VN');
    }
    return product.price?.toLocaleString('vi-VN');
  }, [product]);

  return (
    <div className="group relative overflow-hidden max-h-[250px] transition-all flex flex-col items-center justify-center">
      {/* Image + overlay icons */}
      <div className="relative h-full overflow-hidden inline-block">
        <OptimizedImage
          src={product.thumbnail_url}
          alt={product.name}
          className="w-full h-full object-contain bg-white"
          cloudinaryTransform="w_300,h_300,c_fill,q_auto,f_auto"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <div className="flex gap-2">
            <button 
              onClick={handleAddToCart}
              className="bg-white p-1 rounded-full shadow-md hover:bg-gray-100 transition-colors"
              disabled={status === "loading"}
            >
              <AddShoppingCartOutlinedIcon className="text-gray-800 text-base" />
            </button>
            <button 
              onClick={handleViewProduct}
              className="bg-white p-1 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            >
              <VisibilityOutlinedIcon className="text-gray-800 text-base" />
            </button>
          </div>
        </div>
      </div>

      {/* Product info */}
      <div className="p-3">
        <h4 className="text-gray-800 font-medium text-xs line-clamp-2 mb-2">{product.name}</h4>
        <p className="text-primary font-medium text-center">
          {displayPrice}
          <span className="text-xs inline-block ml-1 relative -top-1 underline"> đ</span>
        </p>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
