import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser, fetchUserProfile } from '../../redux/slices/authSlice';

const Profile = () => {
    const dispatch = useDispatch();
    const { user, loading } = useSelector(state => state.auth);
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
                email: user.email || '',
                phone: user.phone || '',
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updateUser(formData)).unwrap();
            setIsEditing(false);
        } catch (error) {
            console.error('Cập nhật thông tin thất bại:', error);
        }
    };

    const handleCancel = () => {
        setFormData({
            full_name: user.full_name || '',
            email: user.email || '',
            phone: user.phone || '',
        });
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl ml-24">
            <div className="bg-white">
                <div className="flex justify-between mb-6">
                    <h2 className="text-xl font-semibold">THÔNG TIN CÁ NHÂN</h2>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Chỉnh sửa
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Họ và tên
                            </label>
                            <input
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Lưu thay đổi
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center py-3 border-b border-gray-200">
                            <span className="text-sm font-medium text-gray-600 w-32">Họ và tên:</span>
                            <span className="text-gray-800">{user?.full_name || 'Chưa cập nhật'}</span>
                        </div>

                        <div className="flex items-center py-3 border-b border-gray-200">
                            <span className="text-sm font-medium text-gray-600 w-32">Email:</span>
                            <span className="text-gray-800">{user?.email || 'Chưa cập nhật'}</span>
                        </div>

                        <div className="flex items-center py-3 border-b border-gray-200">
                            <span className="text-sm font-medium text-gray-600 w-32">Số điện thoại:</span>
                            <span className="text-gray-800">{user?.phone || 'Chưa cập nhật'}</span>
                        </div>

                        <div className="flex items-start py-3 border-b border-gray-200">
                            <span className="text-sm font-medium text-gray-600 w-32">Địa chỉ:</span>
                            <div className="text-gray-800 flex-1">
                                {user?.address ?  (
                                    <div>{user.address}</div>
                                ) : (
                                    <span>Chưa có địa chỉ nào</span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center py-3">
                            <span className="text-sm font-bold text-gray-600 w-32">Ngày tham gia:</span>
                            <span className="text-gray-800">
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
