import React from 'react';
import breadcrumb from '../assets/breadcrumb.jpg';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import { Link } from 'react-router-dom';

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
};

const Breadcrumbs = ({location}) => {

  const pathParts = location.split("/").filter(Boolean);
  const lastPath = pathParts.length > 0 ? pathParts[pathParts.length - 1] : "";
  const title = pageNameMap[lastPath] || "";

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
                    {title}
                </h1>
                <p className="text-sm sm:text-base gap-2">
                    <Link to="/">Trang chủ</Link>
                    <KeyboardArrowRightOutlinedIcon />
                    <span className='text-primary'>{title}</span>
                </p>
            </div>
        </div>
    );
}

export default Breadcrumbs;
