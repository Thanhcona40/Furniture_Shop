import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import BedOutlinedIcon from '@mui/icons-material/BedOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { clearCart } from '../../redux/slices/cartSlice';

const Sidebar = () => {

  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
  }

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: <DashboardOutlinedIcon /> },
    { path: "/admin/users", label: "Quản lý Người dùng", icon: <GroupOutlinedIcon /> },
    { path: "/admin/products", label: "Quản lý Sản phẩm", icon: <BedOutlinedIcon /> },
    { path: "/admin/categories", label: "Quản lý Danh mục", icon: <CategoryOutlinedIcon /> },
    { path: "/admin/blogs", label: "Quản lý Bài viết", icon: <ArticleOutlinedIcon /> },
    { path: "/admin/orders", label: "Quản lý Đơn hàng", icon: <BusinessCenterOutlinedIcon /> },
  ];
  return (
    <aside className="w-64 h-screen bg-white text-gray-800 fixed shadow-md border-r border-gray-200">
      {/* Logo với màu chủ đạo */}
      <div className="p-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold flex items-center">
          <span className="w-8 h-8 rounded-md bg-primary flex items-center justify-center mr-2 text-white">🛋</span>
          <span className="text-gray-800">Nội Thất </span>
          <span className="text-primary"> Xinh</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">Trang quản trị</p>
      </div>

      <nav className="p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg transition-all text-sm font-medium ${location.pathname === item.path
                    ? "bg-primary/10 text-primary border-l-4 border-primary"
                    : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                <span className={`mr-3 ${location.pathname === item.path
                    ? "text-primary"
                    : "text-gray-500"
                  }`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 bg-gray-50 flex">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 text-primary">
            <AdminPanelSettingsOutlinedIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium">Admin</p>
            <p className="text-xs text-gray-500">Quản trị viên</p>
          </div>
        </div>
        <div className='ml-10 items-center cursor-pointer'
          onClick={handleLogout}>
          <LogoutOutlinedIcon />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
