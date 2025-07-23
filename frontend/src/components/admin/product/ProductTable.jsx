import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import AddVariantForm from './AddVariantForm';
import { deleteVariant, getProducts, toggleFeaturedProduct } from '../../../api/product'; 
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

const ProductTable = ({ products, setProducts, onDelete, onGetAll, onEditModal }) => {
  const [loading, setLoading] = useState(true);
  const [showVariantForm, setShowVariantForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null); 

  useEffect(() => {
    if (!products.length) {
      const fetchProducts = async () => {
        try {
          const response = await getProducts();
          onGetAll(response.data);
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
  }, [products, onGetAll]);

  const handleFeaturedToggle = async (productId, checked) => {
    try {
      await toggleFeaturedProduct(productId, checked);
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, is_featured: checked } : p
        )
      );
      toast.success(`Đã ${checked ? 'đánh dấu' : 'bỏ'} nổi bật`);
    } catch (err) {
      toast.error('Cập nhật nổi bật thất bại');
    }
  };

  if (loading) return <div>Loading...</div>;

  // Xử lý xóa biến thể
  const handleDeleteVariant = async (productId, variantId) => {
    try {
      await deleteVariant(variantId);
      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId
            ? {
                ...p,
                variants: p.variants.filter((v) => v._id !== variantId),
              }
            : p
        )
      );
      toast.success('Xóa biến thể thành công!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  // Mở form sửa biến thể
  const handleEditVariant = (variant) => {
    setSelectedVariant(variant);
    setSelectedProduct({ _id: variant.product_id, variants: [variant] }); // Tạm thời set product để mở form
    setShowVariantForm(true);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr className="py-5">
            <th scope="col" className="px-4 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-tighter whitespace-nowrap">
              Sản phẩm
            </th>
            <th scope="col" className="px-4 py-2 text-left text-sm font-bold text-gray-700 uppercase tracking-tighter whitespace-nowrap">
              Hình ảnh
            </th>
            <th scope="col" className="px-4 py-2 text-left text-sm font-bold text-gray-700 uppercase tracking-tighter whitespace-nowrap">
              Giá
            </th>
            <th scope="col" className="px-4 py-2 text-left text-sm font-bold text-gray-700 uppercase tracking-tighter whitespace-nowrap">
              Tồn kho
            </th>
            <th scope="col" className="px-4 py-2 text-left text-sm font-bold text-gray-700 uppercase tracking-tighter whitespace-nowrap">
              Danh mục
            </th>
            <th scope="col" className="px-4 py-2 text-left text-sm font-bold text-gray-700 uppercase tracking-tighter whitespace-nowrap">
              Biến thể
            </th>
            <th scope="col" className="px-4 py-2 text-right text-sm font-bold text-gray-700 uppercase tracking-tighter whitespace-nowrap">
              Thao tác
            </th>
            <th scope="col" className="px-4 py-2 text-right text-sm font-bold text-gray-700 uppercase tracking-tighter whitespace-nowrap">
              Thêm biến thể
            </th>
            <th scope="col" className="px-4 py-2 text-left text-sm font-bold text-gray-700 uppercase tracking-tighter">
              Nổi bật
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 w-48">
                <div className="font-medium text-gray-900">{product.name}</div>
                <div className="text-sm text-gray-500 line-clamp-2" title={product.description}>
                  {product.description}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <img
                  src={product.thumbnail_url}
                  alt={product.name}
                  className="h-16 w-16 object-cover rounded"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-primary font-medium">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-4 py-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.stock_quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.stock_quantity}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                {product.category_id?.name || 'N/A'}
              </td>
              <td className="px-6 py-4">
                {product.variants && product.variants.length > 0 ? (
                  <div className="space-y-2">
                    {product.variants.map((variant, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                        <div className='flex flex-col'>
                          <span className="text-sm text-gray-600">
                            Màu: {variant.color},Size: {variant.dimensions}, 
                          </span>
                          <span className="text-sm text-gray-600">
                            Giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(variant.price)},Số lượng: {variant.quantity}
                          </span>
                        </div>
                        <div className="">
                          <button
                            onClick={() => handleEditVariant(variant)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Sửa"
                          >
                            <EditOutlinedIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteVariant(product._id, variant._id)}
                            className="text-red-500 hover:text-red-700"
                            title="Xóa"
                          >
                            <DeleteOutlineOutlinedIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400">Không có biến thể</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                <button
                  onClick={() => onEditModal(product)}
                  className="text-primary hover:text-primary-dark"
                  title="Chỉnh sửa"
                >
                  <EditOutlinedIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(product._id)}
                  className="text-red-500 hover:text-red-700"
                  title="Xóa"
                >
                  <DeleteOutlineOutlinedIcon className="w-5 h-5" />
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowVariantForm(true);
                  }}
                  className="text-green-600 hover:text-green-800"
                  title="Thêm biến thể"
                >
                  <AddCircleOutlineOutlinedIcon className="w-5 h-5" />
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={product.is_featured || false}
                  onChange={(e) => handleFeaturedToggle(product._id, e.target.checked)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showVariantForm && selectedProduct && (
        <AddVariantForm
          productId={selectedProduct._id}
          variant={selectedVariant} // Truyền variant để sửa
          onClose={() => {
            setShowVariantForm(false);
            setSelectedVariant(null); // Reset khi đóng
          }}
          onAdd={(variants) => {
            setProducts((prev) =>
              prev.map((p) =>
                p._id === selectedProduct._id
                  ? { ...p, variants: [...(p.variants || []), ...variants] }
                  : p
              )
            );
          }}
          onUpdate={(updatedVariant) => {
            setProducts((prev) =>
              prev.map((p) =>
                p._id === selectedProduct._id
                  ? {
                      ...p,
                      variants: p.variants.map((v) =>
                        v._id === updatedVariant._id ? updatedVariant : v
                      ),
                    }
                  : p
              )
            );
          }}
        />
      )}
    </div>
  );
};

export default ProductTable;