import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const menuItems = [
  { label: 'Thông tin tài khoản', path: '' },
  { label: 'Đơn hàng của bạn', path: 'orders-user' },
  { label: 'Sổ địa chỉ', path: 'address' },
];

const ProfilePageLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-[60vh] flex bg-white">
      {/* Sidebar */}
      <aside className="w-1/4 min-w-[220px] border-r px-8 py-10 text-center">
        <h2 className="text-xl font-semibold mb-8">TRANG TÀI KHOẢN</h2>
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block font-medium transition text-base py-1 ${
                    isActive || (item.path === '' && location.pathname === '/account')
                      ? 'text-orange-500 font-semibold' : 'text-gray-800 hover:text-orange-500'
                  }`
                }
                end={item.path === ''}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>
      {/* Main content */}
      <main className="flex-1 px-5 py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default ProfilePageLayout;
