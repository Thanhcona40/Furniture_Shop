import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { blogAPI } from '../../../api/blog';
import BlogTable from './BlogTable';
import EditBlog from './EditBlog';
import AddBlog from './AddBlog';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);
  const handleOpenEditModal = () => setOpenEditModal(true);
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedBlog(null);
  };

  const handleAdd = (newBlog) => {
    setBlogs((prev) => [newBlog, ...prev]);
    toast.success('Thêm bài viết thành công!');
  };

  const handleEditBlog = (blog) => {
    setSelectedBlog(blog);
    handleOpenEditModal();
  };

  const handleGetBlogs = (data) => {
    setBlogs(data);
  };

  const handleSaveBlog = (updatedBlog) => {
    setBlogs(blogs.map(b => b._id === updatedBlog._id ? updatedBlog : b));
    toast.success('Cập nhật bài viết thành công!');
    handleCloseEditModal();
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      await blogAPI.deleteBlog(blogId);
      setBlogs(blogs.filter(b => b._id !== blogId));
      toast.success('Xóa bài viết thành công!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <div className="p-6 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Bài viết</h1>
        <button
          onClick={handleOpenAddModal}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center"
        >
          <AddOutlinedIcon className="w-5 h-5 mr-2" />
          Thêm Bài viết
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <BlogTable 
          blogs={blogs} 
          onEdit={handleEditBlog}
          onGetAll={handleGetBlogs} 
          onDelete={handleDeleteBlog}
        />
      </div>

      <AddBlog 
        open={openAddModal} 
        onClose={handleCloseAddModal} 
        onAdd={handleAdd} 
      />
      
      <EditBlog 
        open={openEditModal} 
        onClose={handleCloseEditModal} 
        blog={selectedBlog} 
        onSave={handleSaveBlog}
      />
    </div>
  );
};

export default BlogManagement; 