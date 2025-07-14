import React from 'react';
import breadcrumb from '../assets/breadcrumb.jpg';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import { Link, useLocation } from 'react-router-dom';

const pageNameMap = {
  about: "Giới thiệu",
  blog: "Tin tức",
  contact: "Liên hệ",
  product: "Sản phẩm",
  cart: "Giỏ hàng",
  profile: "Hồ sơ",
  address: "Địa chỉ",
  orders: "Đơn hàng",
  allproducts: "Tất cả sản phẩm",
  login: "Đăng nhập tài khoản",
  register: "Đăng kí tài khoản",
  account: "Tài khoản",
  orders_user : "Đơn hàng",
  change_password: "Đổi mật khẩu",
};

function getBreadcrumbs(pathname) {
  const pathParts = pathname.split('/').filter(Boolean);
  let breadcrumbs = [];
  let accumulatedPath = '';

  pathParts.forEach((part, idx) => {
    accumulatedPath += `/${part}`;
    let name = pageNameMap[part];
    // Xử lý route động như /product/:id
    if (!name && idx > 0 && pathParts[idx - 1] === 'product') {
      name = 'Chi tiết sản phẩm';
    }
    if (!name) name = part;
    breadcrumbs.push({ name, path: accumulatedPath });
  });
  return breadcrumbs;
}

const Breadcrumbs = () => {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname);

  // Lấy category từ query string nếu có
  const params = new URLSearchParams(location.search);
  const category = params.get('category');

  // Nếu đang ở allproducts và có category, thêm breadcrumb cho category
  let displayBreadcrumbs = [...breadcrumbs];
  if (
    breadcrumbs.length > 0 &&
    breadcrumbs[breadcrumbs.length - 1].path === '/allproducts' &&
    category
  ) {
    displayBreadcrumbs.push({
      name: category,
      path: `${breadcrumbs[breadcrumbs.length - 1].path}?category=${encodeURIComponent(category)}`
    });
  }

  return (
    <div className="relative h-[200px]">
      <img
        src={breadcrumb}
        alt="Banner nhỏ"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-black/30 z-10" />
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="text-4xl mb-2">
          {displayBreadcrumbs.length > 0 ? displayBreadcrumbs[displayBreadcrumbs.length - 1].name : ''}
        </h1>
        <p className="text-sm sm:text-base flex items-center justify-center">
          <Link to="/">Trang chủ</Link>
          {displayBreadcrumbs.map((bc, idx) => (
            <React.Fragment key={bc.path}>
              <KeyboardArrowRightOutlinedIcon />
              {idx < displayBreadcrumbs.length - 1 ? (
                <Link to={bc.path} className="hover:text-primary">
                  {bc.name}
                </Link>
              ) : (
                <span className="text-primary">{bc.name}</span>
              )}
            </React.Fragment>
          ))}
        </p>
      </div>
    </div>
  );
};

export default Breadcrumbs;
