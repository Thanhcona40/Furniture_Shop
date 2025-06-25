import { useState, useEffect } from 'react';
import { Modal } from '@mui/material';
import { toast } from 'react-toastify';
import { addVariant, updateVariant } from '../../../api/product';
import { uploadToCloudinary } from '../../../utils/uploadToCloudinary';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

const AddVariantForm = ({ productId, variant, onClose, onAdd, onUpdate }) => {
  const [colors, setColors] = useState('');
  const [variants, setVariants] = useState([]);
  const [uploading, setUploading] = useState(false);

  const sizes = ['Nhỏ', 'To'];

  useEffect(() => {
    if (variant) {
      setColors(variant.color || '');
      setVariants([
        {
          _id: variant._id,
          color: variant.color || '',
          dimensions: variant.dimensions || '',
          price: variant.price || 0,
          quantity: variant.quantity || 0,
          url_media: variant.url_media || '',
        },
      ]);
    } else {
      setColors('');
      setVariants([]);
    }
  }, [variant]);

  useEffect(() => {
    if (!variant) {
      const colorArray = colors.split(',').map((c) => c.trim()).filter((c) => c);
      const newVariants = colorArray.flatMap((color) =>
        sizes.map((size) => ({
          color,
          dimensions: size,
          price: 0,
          quantity: 0,
          url_media: '',
        }))
      );
      setVariants((prev) =>
        newVariants.map((newVariant, index) => {
          const existingVariant = prev[index] || {};
          return {
            ...newVariant,
            price: existingVariant.price || 0,
            quantity: existingVariant.quantity || 0,
            url_media: existingVariant.url_media || '',
          };
        })
      );
    }
  }, [colors, sizes, variant]);

  const handleInputChange = (index, field, value) => {
  let newValue = value;
  
  if (field === 'price' || field === 'quantity') {
    // Xóa tất cả các ký tự không phải số
    newValue = value.replace(/\D/g, '');
    
    // Nếu giá trị rỗng sau khi xử lý, set thành 0
    if (newValue === '') {
      newValue = 0;
    } else {
      // Chuyển thành number và loại bỏ số 0 ở đầu
      newValue = parseInt(newValue, 10);
    }
  }
  
  setVariants((prev) =>
    prev.map((v, i) => (i === index ? { ...v, [field]: newValue } : v))
  );
};

  const handleImageChange = async (index, event) => {
    event.stopPropagation();
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      handleInputChange(index, 'url_media', url);
      setUploading(false);
    } catch (error) {
      toast.error('Lỗi tải ảnh lên: ' + error.message);
      setUploading(false);
    }
  };

  const handleSaveVariants = async (e) => {
    e.preventDefault();
    try {
      const validVariants = variants.filter(
        (v) => v.color && v.dimensions && v.price >= 0 && v.quantity >= 0
      );
      if (validVariants.length !== variants.length) {
        toast.error('Vui lòng điền đầy đủ thông tin cho tất cả biến thể!');
        return;
      }

      if (variant) {
        // Cập nhật biến thể
        const updatedVariant = await updateVariant(variant._id, validVariants[0]);
        onUpdate(updatedVariant.data);
        toast.success('Cập nhật biến thể thành công!');
      } else {
        // Thêm mới biến thể
        const addedVariants = [];
        for (const variant of validVariants) {
          const response = await addVariant(productId, variant);
          addedVariants.push(response.data);
        }
        onAdd(addedVariants);
        toast.success('Thêm biến thể thành công!');
      }

      setColors('');
      setVariants([]);
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Lỗi xảy ra');
    }
  };

  const handleCancelVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="flex items-center justify-center"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6">
        <div className="border-b border-gray-200 pb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            {variant ? 'Sửa biến thể' : 'Thêm biến thể sản phẩm'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <CloseOutlinedIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {!variant && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhập màu (cách nhau bằng dấu phẩy)
              </label>
              <input
                value={colors}
                onChange={(e) => setColors(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ví dụ: Đỏ, Cam, Vàng"
              />
            </div>
          )}

          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-md p-4 bg-gray-50"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Màu
                    </label>
                    <input
                      value={variant.color}
                      onChange={(e) => handleInputChange(index, 'color', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!!variant._id} // Không sửa màu nếu là biến thể đã lưu
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kích thước
                    </label>
                    <select
                      value={variant.dimensions}
                      onChange={(e) => handleInputChange(index, 'dimensions', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {sizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá
                    </label>
                    <input
                      type="number"
                      value={variant.price || ''}
                      onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số lượng
                    </label>
                    <input
                      type="number"
                      value={variant.quantity || ''}
                      onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hình ảnh
                    </label>
                    <div className="flex items-center space-x-2">
                      <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                        Chọn ảnh
                        <input
                          type="file"
                          className="sr-only"
                          onChange={(e) => handleImageChange(index, e)}
                        />
                      </label>
                      {variant.url_media && (
                        <img
                          src={variant.url_media}
                          alt={`Variant ${index}`}
                          className="h-10 w-10 object-cover rounded"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {!variant && (
                  <button
                    onClick={() => handleCancelVariant(index)}
                    className="mt-2 text-red-500 hover:text-red-700"
                  >
                    <CloseOutlinedIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handleSaveVariants}
              disabled={variants.length === 0 || uploading}
              className={`px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                variants.length === 0 || uploading
                  ? 'bg-primary-light cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark'
              }`}
            >
              {uploading ? 'Đang tải lên...' : variant ? 'Lưu thay đổi' : 'Lưu tất cả'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddVariantForm;