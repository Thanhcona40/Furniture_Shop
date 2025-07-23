import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { updateProduct } from '../../../api/product';
import { Modal } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { getCategories } from '../../../api/category';
import { uploadToCloudinary } from '../../../utils/uploadToCloudinary';

const EditProduct = ({ open, onClose, product, onSave }) => {
  const [editedProduct, setEditedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        toast.error('Lỗi xảy ra');
      }
    };
    fetchCategories();
  }, []);

  // Đồng bộ editedProduct với product khi modal mở
  useEffect(() => {
    if (product) {
      setEditedProduct({ ...product }); // Sao chép object để tránh thay đổi trực tiếp props
      setSelectedImage(product.thumbnail_url || null);
    } else {
      setEditedProduct(null);
      setSelectedImage(null);
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value}));
  };

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);

      try {
        const imageUrl = await uploadToCloudinary(file); // Thêm hàm này
        setSelectedImage(imageUrl);
        setEditedProduct((prev) => ({ ...prev, thumbnail_url: imageUrl }));
      } catch (err) {
        toast.error('Lỗi tải lên ảnh');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!editedProduct) return;

    try {
      const response = await updateProduct(editedProduct._id, editedProduct);
      onSave(response.data);
      onClose();
      toast.success('Cập nhật sản phẩm thành công!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  if (!open || !editedProduct) return null; // Tránh render khi chưa có dữ liệu

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="edit-product-modal"
    >
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
          {/* Header */}
          <div className="border-b border-gray-200 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <EditOutlinedIcon className="w-5 h-5 mr-2 text-primary" />
              Chỉnh sửa sản phẩm
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <CloseOutlinedIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Form content */}
          <form onSubmit={handleSaveProduct} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cột trái */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editedProduct.name || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₫</span>
                    <input
                      type="number"
                      name="price"
                      value={editedProduct.price || ''}
                      onChange={handleInputChange}
                      className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượng tồn kho <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={editedProduct.stock_quantity || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    min="0"
                  />
                </div>
              </div>

              {/* Cột phải */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả sản phẩm
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    value={editedProduct.description || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục
                  </label>
                  <select
                    name="category_id"
                    value={editedProduct.category_id?._id || editedProduct.category_id || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đánh dấu nổi bật
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={editedProduct?.is_featured || false}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className="text-gray-700 text-sm">Sản phẩm nổi bật</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hình ảnh đại diện
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                      {isUploading ? 'Đang tải lên...' : 'Chọn ảnh'}
                      <input
                        type="file"
                        className="sr-only"
                        onChange={handleImageChange}
                        accept="image/*"
                        disabled={isUploading}
                      />
                    </label>
                    {(selectedImage || editedProduct.thumbnail_url) && (
                      <img
                        src={selectedImage || editedProduct.thumbnail_url}
                        alt="Preview"
                        className="h-16 w-16 object-cover rounded border"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer với nút action */}
            <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default EditProduct;