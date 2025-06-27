import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { InputNumber } from "antd";
import { fetchCartItems, initializeCart, removeCartItemAction, updateCartItemQuantity, updateCartItemVariant } from "../redux/slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userId = user?._id;
  const { cartId, cartItems, status } = useSelector((state) => state.cart);

  useEffect(() => {
    if (userId && !cartId) {
      dispatch(initializeCart(userId));
    }
  }, [userId, cartId, dispatch]);

  // Fetch cart items only when cartId changes (not when cart items update)
  useEffect(() => {
    if (cartId && cartItems.length === 0) {
      dispatch(fetchCartItems(cartId));
    }
  }, [cartId, dispatch]);

  if (!userId) {
    return <div>Bạn cần đăng nhập để xem giỏ hàng.</div>;
  }

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Lỗi khi tải giỏ hàng</div>;

  const handleAmountChange = (value, cartItemId) => {
    const newAmount = value || 1;
    dispatch(updateCartItemQuantity({ cartItemId, quantity: newAmount }));
  };

  const handleRemoveItem = (cartItemId) => {
    dispatch(removeCartItemAction(cartItemId));
    toast.success("Xóa thành công !")
  };

  const handleUpdateVariant = (cartItemId, variantId) => {
    dispatch(updateCartItemVariant({ cartItemId, variantId }));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * (item.variant_id?.price || 0),
    0
  );

  return (
    <div className="mx-auto w-9/12 py-8 space-y-6">
      <p className="font-semibold text-3xl mb-5">Giỏ hàng của bạn</p>
      <div className="border border-primary">
        {cartItems.length > 0 ? (
          <ul>
            <li>
              <div className="flex items-center py-2 px-4 font-semibold">
                <span className="w-1/2 pt-4 pl-5">Sản phẩm</span>
                <div className="flex w-1/2 pt-4 justify-between items-center">
                  <span>Giá</span>
                  <span>Số lượng</span>
                  <span className="pr-5">Tổng</span>
                </div>
              </div>
              <div className="w-[95%] border-b border-primary mx-auto" />
            </li>
            {cartItems.map((item) => {
              const variants = item.product_id?.variants || [];
              // Lấy tất cả màu và kích thước có trong variants
              const colors = Array.from(new Set(variants.map(v => v.color)));
              const dimensions = Array.from(new Set(variants.map(v => v.dimensions)));
              // Lấy variant hiện tại
              const currentVariant = item.variant_id || {};
              // State tạm thời cho chọn màu/kích thước (nếu muốn tối ưu UX hơn nữa thì dùng useState riêng cho từng item)
              // Nhưng ở đây sẽ lấy luôn từ variant_id hiện tại
              const selectedColor = currentVariant.color;
              const selectedDimensions = currentVariant.dimensions;
              console.log(item);

              // Hàm xử lý chọn lại màu/kích thước
              const handleSelectVariant = (cartItemId, color, dimensions) => {
                // Tìm variant phù hợp
                const foundVariant = variants.find(v => v.color === color && v.dimensions === dimensions);
                if (foundVariant) {
                  handleUpdateVariant(cartItemId, foundVariant._id);
                }
              };

              return (
                <li key={item._id} className="flex items-center px-4 py-2">
                  <span className="w-1/2 pt-4 pl-5 flex items-center space-x-3">
                    <ClearOutlinedIcon
                      className="cursor-pointer text-gray-500"
                      fontSize="small"
                      onClick={() => handleRemoveItem(item._id)}
                    />
                    {/* Hiển thị ảnh variant hiện tại */}
                    <img 
                      src={currentVariant.url_media || item.product_id?.thumbnail_url} 
                      alt={item.product_id?.name} 
                      className="w-20 h-20 inline-block mr-2 object-cover" 
                    />
                    <div>
                      <p className="text-gray-800 font-semibold">{item.product_id?.name}</p>
                      {/* Chọn lại biến thể */}
                      <div className="flex flex-col gap-1">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Chọn màu</label>
                          <div className="flex gap-1 flex-wrap">
                            {colors.map((color) => (
                              <button
                                key={color}
                                onClick={() => handleSelectVariant(item._id, color, selectedDimensions)}
                                className={`px-2 py-1 text-xs border rounded ${
                                  selectedColor === color
                                    ? "bg-primary text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                {color}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Chọn kích thước</label>
                          <div className="flex gap-1 flex-wrap">
                            {dimensions.map((dimension) => (
                              <button
                                key={dimension}
                                onClick={() => handleSelectVariant(item._id, selectedColor, dimension)}
                                className={`px-2 py-1 text-xs border rounded ${
                                  selectedDimensions === dimension
                                    ? "bg-primary text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                {dimension}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </span>
                  <div className="flex w-1/2 pt-4 justify-between items-center">
                    <span>
                      {(currentVariant.price || item.product_id?.price).toLocaleString("vi-VN")}
                      <span className="text-xs inline-block ml-1 relative -top-1 underline">đ</span>
                    </span>
                    <InputNumber
                      min={1}
                      value={item.quantity}
                      onChange={(value) => handleAmountChange(value, item._id)}
                    />
                    <span className="pr-5">
                      {((currentVariant.price || item.product_id?.price) * item.quantity).toLocaleString("vi-VN")}
                      <span className="text-xs inline-block ml-1 relative -top-1 underline">đ</span>
                    </span>
                  </div>
                </li>
              );
            })}
            <div className="w-[95%] border-b mt-5 border-gray-200 mx-auto" />
            <div className="flex justify-end items-center py-4 pr-5 space-x-10">
              <span className="font-semibold text-xl py-3">Tổng số thành tiền:</span>
              <span className="text-primary font-semibold text-xl">
                {total.toLocaleString("vi-VN")}
                <span className="text-xs inline-block ml-1 relative -top-1 underline">đ</span>
              </span>
            </div>
            <div className="flex justify-end items-center py-4 pr-5 space-x-10">
              <Link to="/allproducts" className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition">
                Tiếp tục mua sắm
              </Link>
              <button className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition">
                Tiến hành thanh toán
              </button>
            </div>
          </ul>
        ) : (
          <p className="p-5">Không có sản phẩm nào trong giỏ hàng. Quay lại cửa hàng để tiếp tục mua sắm.</p>
        )}
      </div>
    </div>
  );
};

export default Cart;