import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CircularProgress from '@mui/material/CircularProgress';

const CategoryTable = ({ categories, onEdit, onDelete, loading }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-tighter whitespace-nowrap">Tên</th>
            <th scope="col" className="px-4 py-2 text-left text-sm font-bold text-gray-700 uppercase tracking-tighter whitespace-nowrap">Hình ảnh</th>
            <th scope="col" className="px-4 py-2 text-right text-sm font-bold text-gray-700 uppercase tracking-tighter whitespace-nowrap">Thao tác</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan="3" className="text-center py-4">
                <CircularProgress />
              </td>
            </tr>
          ) : (
            categories?.map((category) => (
              <tr key={category._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{category.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-16 w-16 object-cover rounded"
                    />
                  ) : (
                    <div className="text-gray-400">Không có ảnh</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => onEdit(category)}
                    className="text-primary hover:text-primary-dark"
                    title="Chỉnh sửa"
                  >
                    <EditOutlinedIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(category._id)}
                    className="text-red-500 hover:text-red-700"
                    title="Xóa"
                  >
                    <DeleteOutlineOutlinedIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            )))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;