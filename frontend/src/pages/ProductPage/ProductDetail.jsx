import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "../../api/product";
import { addCartItem, initializeCart } from "../../redux/actions/cartActions";
import { Divider } from "antd";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { cartId, status } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedDimensions, setSelectedDimensions] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(id);
        const updatedProduct = {
          ...response.data,
          variants: response.data.variants || [],
        };
        setProduct(updatedProduct);
        if (updatedProduct.variants.length > 0) {
          const firstVariant = updatedProduct.variants[0];
          setSelectedColor(firstVariant.color);
          setSelectedDimensions(firstVariant.dimensions);
        }
        setLoading(false);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Lỗi tải sản phẩm");
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (user?._id && !cartId && status !== "loading") {
      dispatch(initializeCart());
    }
  }, [user, cartId, dispatch, status]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Sản phẩm không tồn tại</div>;

  const filteredVariants = product.variants.filter(
    (variant) =>
      (!selectedColor || variant.color === selectedColor) &&
      (!selectedDimensions || variant.dimensions === selectedDimensions)
  );

  const currentVariant = filteredVariants.length > 0
    ? filteredVariants[0]
    : product;

  const uniqueColors = [...new Set(product.variants.map((v) => v.color))];
  const uniqueDimensions = [...new Set(product.variants.map((v) => v.dimensions))];
  const uniqueImages = uniqueColors.map((color) => {
    const variant = product.variants.find((v) => v.color === color);
    return variant?.url_media || product.thumbnail_url;
  });

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      return;
    }
    
    if (!cartId) {
      toast.error("Đang khởi tạo giỏ hàng, vui lòng thử lại!");
      return;
    }

    if (!selectedColor || !selectedDimensions) {
      toast.error("Vui lòng chọn màu sắc và kích thước!");
      return;
    }

    // Find the selected variant
    const selectedVariant = product.variants.find(
      variant => variant.color === selectedColor && variant.dimensions === selectedDimensions
    );

    if (!selectedVariant) {
      toast.error("Không tìm thấy biến thể đã chọn!");
      return;
    }

    dispatch(
      addCartItem({
        cart_id: cartId,
        product_id: product._id,
        variant_id: selectedVariant._id,
        quantity: quantity,
      })
    );
    toast.success("Đã thêm vào giỏ hàng!");
  };

  return (
    <div className="my-5 mx-auto max-w-[1110px] grid grid-cols-2 gap-8">
      <div className="relative">
        <img
          src={currentVariant.url_media || product.thumbnail_url}
          alt={product.name}
          className="object-cover w-full h-[500px] rounded-lg shadow-md"
        />
        {uniqueImages.length > 0 && (
          <div className="mt-4 flex gap-2 overflow-x-auto">
            {uniqueImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.name} - Ảnh ${uniqueColors[index]}`}
                className={`w-24 h-24 object-cover rounded-md cursor-pointer border-2 ${
                  currentVariant.url_media === image || (!currentVariant.url_media && image === product.thumbnail_url)
                    ? "border-primary"
                    : "border-transparent hover:border-gray-300"
                }`}
                onClick={() => {
                  const variant = product.variants.find((v) => v.url_media === image || v.color === uniqueColors[index]);
                  if (variant) {
                    setSelectedColor(variant.color);
                    setSelectedDimensions(variant.dimensions);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <div className="space-y-6">
          <p className="font-medium text-3xl">{product.name}</p>
          <div className="relative mb-4 mt-5">
            <h3 className="relative z-10 inline-block bg-primary text-white text-xl font-normal px-6 py-2 skew-x-[12deg]">
              <span className="inline-block skew-x-[-12deg] font-semibold text-2xl">
                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                  currentVariant.price || product.price
                )}
              </span>
            </h3>
          </div>
          <p className="text-gray-600">{product.description}</p>
          <span className="border border-b w-full"></span>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Màu sắc</label>
              <div className="flex gap-2">
                {uniqueColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedColor === color ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {color}
                  </button>
                ))}
                {!uniqueColors.length && <span className="text-gray-400">Không có màu sắc</span>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kích thước</label>
              <div className="flex gap-2">
                {uniqueDimensions.map((dimension) => (
                  <button
                    key={dimension}
                    onClick={() => setSelectedDimensions(dimension)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedDimensions === dimension ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {dimension}
                  </button>
                ))}
                {!uniqueDimensions.length && <span className="text-gray-400">Không có kích thước</span>}
              </div>
            </div>
            <Divider/>
            <div className="flex items-center gap-3">
              <label className="block text-lg font-medium text-primary-light">Số lượng</label>
              <div className="flex items-center gap-2">
                <button
                  className="w-8 h-8 flex items-center justify-center border bg-white rounded text-lg font-bold hover:bg-gray-200"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  type="button"
                >-</button>
                <span className="px-6 h-8 flex items-center justify-center  bg-white ">{quantity}</span>
                <button
                  className="w-8 h-8 flex items-center justify-center border bg-white rounded text-lg font-bold hover:bg-gray-200"
                  onClick={() => setQuantity(q => q + 1)}
                  type="button"
                >+</button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Số lượng trong kho : </label>
              <span className="text-lg font-semibold text-primary">
                {currentVariant.quantity || product.stock_quantity}
              </span>
            </div>
          </div>
          <button onClick={handleAddToCart} className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition-colors">
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;