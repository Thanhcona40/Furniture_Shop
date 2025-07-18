import React, { useState, useEffect } from 'react';
import { 
  getUserAddresses, 
  createUserAddress, 
  updateUserAddress, 
  deleteUserAddress, 
  setDefaultAddress,
  getProvinceNameById,
  getDistrictNameById,
  getWardNameById
} from '../../api/address';
import AddressForm from '../../components/checkout/AddressForm';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Alert,
  Snackbar,
  Divider
} from '@mui/material';
import { 
  LocationOn as LocationIcon
} from '@mui/icons-material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

const AddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [addressNames, setAddressNames] = useState({}); // {addressId: {province, district, ward}}

  // Load danh sách địa chỉ
  const loadAddresses = async () => {
    try {
      setLoading(true);
      const response = await getUserAddresses();
      setAddresses(response.data);
      // Lấy tên tỉnh/quận/xã cho từng address
      if (response.data.length > 0) {
        Promise.all(response.data.map(async (address) => {
          const [province, district, ward] = await Promise.all([
            getProvinceNameById(address.address.province_id).then(res => res.data.name),
            getDistrictNameById(address.address.district_id).then(res => res.data.name),
            getWardNameById(address.address.ward_id).then(res => res.data.name),
          ]);
          return { id: address._id, province, district, ward };
        })).then(results => {
          const namesMap = {};
          results.forEach(r => {
            namesMap[r.id] = { province: r.province, district: r.district, ward: r.ward };
          });
          setAddressNames(namesMap);
        });
      } else {
        setAddressNames({});
      }
    } catch (error) {
      showSnackbar('Có lỗi xảy ra khi tải danh sách địa chỉ', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Mở dialog thêm địa chỉ mới
  const handleAddAddress = () => {
    setEditingAddress(null);
    setFormData({});
    setOpenDialog(true);
  };

  // Mở dialog sửa địa chỉ
  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setOpenDialog(true);
  };

  // Xóa địa chỉ
  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      try {
        await deleteUserAddress(addressId);
        showSnackbar('Xóa địa chỉ thành công');
        loadAddresses();
      } catch (error) {
        showSnackbar('Có lỗi xảy ra khi xóa địa chỉ', 'error');
      }
    }
  };

  // Đặt làm địa chỉ mặc định
  const handleSetDefault = async (addressId) => {
    try {
      await setDefaultAddress(addressId);
      showSnackbar('Đặt địa chỉ mặc định thành công');
      loadAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      showSnackbar('Có lỗi xảy ra khi đặt địa chỉ mặc định', 'error');
    }
  };

  // Lưu địa chỉ (thêm mới hoặc cập nhật)
  const handleSaveAddress = async () => {
    // Validation cơ bản
    if (!formData.full_name || !formData.email || !formData.phone || !formData.detail || 
        !formData.province_id || !formData.district_id || !formData.ward_id) {
      showSnackbar('Vui lòng điền đầy đủ thông tin', 'error');
      return;
    }

    try {
      if (editingAddress) {
        // Cập nhật địa chỉ
        await updateUserAddress(editingAddress._id, formData);
        showSnackbar('Cập nhật địa chỉ thành công');
      } else {
        // Thêm địa chỉ mới
        await createUserAddress(formData);
        showSnackbar('Thêm địa chỉ thành công');
      }
      setOpenDialog(false);
      loadAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      showSnackbar('Có lỗi xảy ra khi lưu địa chỉ', 'error');
    }
  };

  // Đóng dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAddress(null);
    setFormData({});
  };

  // Format địa chỉ để hiển thị
  const formatAddress = (address) => {
    const names = addressNames[address._id];
    if (!names) return address.address.detail;
    return [address.address.detail, names.ward, names.district, names.province].filter(Boolean).join(', ');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6">
      <div className="flex justify-between items-center mb-6">
        <p className="font-semibold text-3xl">
          Địa chỉ của bạn
        </p>
        <button
          onClick={handleAddAddress}
          className="bg-primary hover:bg-primary-dark text-white p-4 rounded-md"
        >
          Thêm địa chỉ
        </button>
      </div>
      <Divider />
      {addresses.length === 0 ? (
        <div className="text-center py-12 border rounded bg-white">
          <LocationIcon className="text-gray-400 text-6xl mb-4" />
          <div className="text-lg font-semibold mb-2">Chưa có địa chỉ nào</div>
          <div className="mb-4 text-gray-500">Thêm địa chỉ để thuận tiện cho việc giao hàng</div>
          <button
            onClick={handleAddAddress}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded font-semibold"
          >
            Thêm địa chỉ đầu tiên
          </button>
        </div>
      ) : (
        <div className="divide-y divide-gray-200 bg-white">
          {addresses.map((address, idx) => (
            <div key={address._id} className="p-6 flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-base">Họ tên: </span>{address.full_name}
                  {address.is_default && (
                    <span className="text-green-600 text-xs font-medium ml-2 flex items-center gap-1">
                      <CheckCircleOutlinedIcon fontSize='small' className='bg-green-600 text-white rounded-full'/>
                      Địa chỉ mặc định
                    </span>
                  )}
                </div>
                <div className="mb-1 text-gray-700">
                  <span className="font-medium">Số điện thoại:</span> {address.phone}
                </div>
                <div className="mb-1 text-gray-700">
                  <span className="font-medium">Email:</span> {address.email}
                </div>
                <div className="mb-1 text-gray-700">
                  <span className="font-medium">Địa chỉ:</span> {formatAddress(address)}
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end min-w-[160px]">
                {!address.is_default && (
                  <button
                    onClick={() => handleSetDefault(address._id)}
                    className="border border-primary text-primary hover:bg-primary hover:text-white px-3 py-1 rounded transition text-sm mb-1"
                  >
                    Đặt làm mặc định
                  </button>
                )}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEditAddress(address)}
                    className="text-blue-500 hover:underline text-sm font-semibold px-2 py-1"
                  >
                    Chỉnh sửa địa chỉ
                  </button>
                  {!address.is_default && (
                    <button
                      onClick={() => handleDeleteAddress(address._id)}
                      className="text-red-600 hover:underline text-sm font-semibold px-2 py-1"
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog thêm/sửa địa chỉ */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingAddress ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}
        </DialogTitle>
        <DialogContent>
          <AddressForm
            defaultAddress={editingAddress}
            onChange={setFormData}
            editableEmail={true}
          />
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={handleCloseDialog} color="inherit">
            Hủy
          </Button>
          <Button 
            onClick={handleSaveAddress} 
            variant="contained"
            className="bg-blue-600 hover:bg-blue-700"
          >
            {editingAddress ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          className="w-full"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddressPage;
