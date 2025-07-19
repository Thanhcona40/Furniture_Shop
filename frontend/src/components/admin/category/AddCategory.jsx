import { useState } from 'react';
import { addCategory } from '../../../api/category';
import { Modal } from '@mui/material';
import { toast } from 'react-toastify';
import { uploadToCloudinary } from '../../../utils/uploadToCloudinary';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CircularProgress from '@mui/material/CircularProgress';

const AddCategory = ({ onAdd, open, onClose }) => {
  const [newCategory, setNewCategory] = useState({
    name: '',
    image: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await addCategory(newCategory);
      onAdd(response.data);
      setNewCategory({ name: '', image: '' });
      setSelectedImage(null);
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      try {
        const file = await uploadToCloudinary(e.target.files[0]);
        setSelectedImage(file);
        setNewCategory(prev => ({ ...prev, image: file }));
      } catch (err) {
        toast.error('Lỗi tải lên ảnh');
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="border-b border-gray-200 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <AddOutlinedIcon className="w-5 h-5 mr-2 text-primary" />
              Thêm Danh mục
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <CloseOutlinedIcon className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleAddCategory} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục</label>
              <input
                type="text"
                name="name"
                value={newCategory.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh</label>
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  {isUploading ? <><CircularProgress size={16} sx={{mr:1}} /> Đang tải lên...</> : 'Chọn ảnh'}
                  <input 
                    type="file" 
                    className="sr-only" 
                    onChange={handleImageChange}
                    accept="image/*"
                    disabled={isUploading}
                    required
                  />
                </label>
                {selectedImage && (
                  <img 
                    src={selectedImage} 
                    alt="Preview" 
                    className="h-16 w-16 object-cover rounded border"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
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
                Thêm mới
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddCategory;