import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Modal } from '@mui/material';
import { blogAPI } from '../../../api/blog';
import { uploadToCloudinary } from '../../../utils/uploadToCloudinary';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const EditBlog = ({ blog, onSave, open, onClose }) => {
  const [editedBlog, setEditedBlog] = useState(blog);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setEditedBlog(blog);
    setSelectedImage(blog?.image || null);
  }, [blog]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedBlog(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      try {
        const file = await uploadToCloudinary(e.target.files[0]);
        setSelectedImage(file);
        setEditedBlog(prev => ({ ...prev, image: file }));
      } catch (err) {
        toast.error('Lỗi tải lên ảnh');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    try {
      const response = await blogAPI.updateBlog(editedBlog._id, editedBlog);
      onSave(response.data);
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="border-b border-gray-200 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <EditOutlinedIcon className="w-5 h-5 mr-2 text-primary" />
              Chỉnh sửa Bài viết
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <CloseOutlinedIcon className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSaveBlog} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
              <input
                type="text"
                name="title"
                value={editedBlog?.title || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tác giả</label>
              <input
                type="text"
                name="author"
                value={editedBlog?.author || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
              <textarea
                name="content"
                value={editedBlog?.content || ''}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh</label>
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
                {(selectedImage || editedBlog?.image) && (
                  <img 
                    src={selectedImage || editedBlog.image} 
                    alt="Preview" 
                    className="h-16 w-16 object-cover rounded border"
                  />
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isFeatured"
                checked={editedBlog?.isFeatured || false}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Bài viết nổi bật
              </label>
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
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default EditBlog; 