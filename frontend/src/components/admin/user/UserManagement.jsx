import { useEffect, useState } from "react";
import { fetchUsers, fetchUserOrderStatusCount } from '../../../api/user';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SimpleConfirmDialog from './SimpleConfirmDialog';
import { deleteUser } from '../../../api/user';
import UserOrderStatusModal from './UserOrderStatusModal';
import CircularProgress from '@mui/material/CircularProgress';
import useListPage from '../../../hooks/useListPage';

const UserManagement = () => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [orderCounts, setOrderCounts] = useState({});
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderModalUser, setOrderModalUser] = useState(null);

  // Use custom hook for list management
  const {
    data: users,
    loading,
    error,
    removeItem,
    setData: setUsers,
  } = useListPage(() => fetchUsers(), {
    itemsPerPage: 20,
    autoFetch: true,
  });

  useEffect(() => {
    const loadOrderCounts = async () => {
      if (users.length === 0) return;
      
      // Lấy order count theo status cho từng user
      const counts = {};
      await Promise.all(
        users.map(async (user) => {
          const statusCount = await fetchUserOrderStatusCount(user._id);
          counts[user._id] = statusCount;
        })
      );
      setOrderCounts(counts);
    };
    loadOrderCounts();
  }, [users]);

  const handleOpenConfirm = (userId) => {
    setSelectedUserId(userId);
    setConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
    setSelectedUserId(null);
  };

  const handleDeleteUser = async () => {
    if (!selectedUserId) return;
    try {
      setActionLoading(true);
      await deleteUser(selectedUserId);
      removeItem(selectedUserId);
      handleCloseConfirm();
    } catch (err) {
      alert('Xóa người dùng thất bại!');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenOrderModal = (user) => {
    setOrderModalUser(user);
    setOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    setOrderModalOpen(false);
    setOrderModalUser(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý Người dùng</h1>
      {loading ? (
        <div className="flex justify-center"><CircularProgress /></div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th scope="col" className="px-4 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-tighter whitespace-nowrap">Tên</th>
                <th scope="col" className="px-4 py-2 text-left text-sm font-bold text-gray-700 uppercase tracking-tighter whitespace-nowrap">Email</th>
                <th scope="col" className="px-4 py-2 text-left text-sm font-bold text-gray-700 uppercase tracking-tighter whitespace-nowrap">Vai trò</th>
                <th scope="col" className="px-4 py-2 text-left text-sm font-bold text-gray-700 uppercase tracking-tighter whitespace-nowrap">Ngày tạo</th>
                <th scope="col" className="px-4 py-2 text-center text-sm font-bold text-gray-700 uppercase tracking-tighter whitespace-nowrap">Đơn hàng</th>
                <th scope="col" className="px-4 py-2 text-right text-sm font-bold text-gray-700 uppercase tracking-tighter whitespace-nowrap">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{user.name || user.full_name || '---'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.role || 'user'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {orderCounts[user._id] ? (
                      <>
                        <span className="text-xs font-semibold text-blue-700">Tổng: {Object.values(orderCounts[user._id]).reduce((a, b) => a + b, 0)}</span>
                        <button
                          className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                          onClick={() => handleOpenOrderModal(user)}
                        >
                          Xem chi tiết
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400 flex items-center gap-1"><CircularProgress size={14} /> Đang tải...</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleOpenConfirm(user._id)}
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
      )}
      <SimpleConfirmDialog
        open={confirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleDeleteUser}
        title="Xác nhận xóa người dùng"
        message="Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        loading={actionLoading}
      />
      <UserOrderStatusModal
        open={orderModalOpen}
        onClose={handleCloseOrderModal}
        user={orderModalUser}
        orderStatusCount={orderModalUser ? orderCounts[orderModalUser._id] : null}
      />
    </div>
  );
};

export default UserManagement;