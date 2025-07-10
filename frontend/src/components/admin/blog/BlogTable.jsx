import { useEffect } from 'react';
import { blogAPI } from '../../../api/blog';
import { toast } from 'react-toastify';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import StarIcon from '@mui/icons-material/Star';

const BlogTable = ({ blogs, onEdit, onGetAll, onDelete }) => {
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await blogAPI.getAllBlogs();
        onGetAll(response.data);
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Lỗi tải bài viết');
      }
    };
    fetchBlogs();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-tighter whitespace-nowrap">Tiêu đề</th>
            <th scope="col" className="px-4 py-2 text-left text-sm font-bold text-gray-700 uppercase tracking-tighter whitespace-nowrap">Tác giả</th>
            <th scope="col" className="px-4 py-2 text-left text-sm font-bold text-gray-700 uppercase tracking-tighter whitespace-nowrap">Ngày đăng</th>
            <th scope="col" className="px-4 py-2 text-left text-sm font-bold text-gray-700 uppercase tracking-tighter whitespace-nowrap">Nổi bật</th>
            <th scope="col" className="px-4 py-2 text-right text-sm font-bold text-gray-700 uppercase tracking-tighter whitespace-nowrap">Thao tác</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {blogs?.map((blog) => (
            <tr key={blog._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900 max-w-xs truncate">{blog.title}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-gray-900">{blog.author}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-gray-900">{formatDate(blog.datePosted)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {blog.isFeatured ? (
                  <StarIcon className="w-5 h-5 text-yellow-500" />
                ) : (
                  <div className="text-gray-400">-</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button
                  onClick={() => onEdit(blog)}
                  className="text-primary hover:text-primary-dark"
                  title="Chỉnh sửa"
                >
                  <EditOutlinedIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(blog._id)}
                  className="text-red-500 hover:text-red-700"
                  title="Xóa"
                >
                  <DeleteOutlineOutlinedIcon className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlogTable; 