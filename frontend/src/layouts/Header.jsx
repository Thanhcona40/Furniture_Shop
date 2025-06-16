import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import DehazeOutlinedIcon from '@mui/icons-material/DehazeOutlined';
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import HeadsetRoundedIcon from '@mui/icons-material/HeadsetRounded';


const Header = ({ isTransparent }) => {

    const location = useLocation();
    const currentPath = location.pathname;

    const isActive = (path) => currentPath === path;
    return (
        <header className={`w-full left-0 z-30 ${isTransparent ? "absolute" : "relative bg-white"}`}>
            <div className="relative z-10 w-9/12 mx-auto">
                {/* TOP BAR */}
                <div className={`flex items-center justify-between px-8 py-4 ${isTransparent ? 'bg-transparent' : 'bg-white'} gap-8`}>
                    <Link to="/" className={`text-2xl font-bold whitespace-nowrap text-blue-700`}>
                        shop furniture
                    </Link>

                    <div className="flex-1 flex justify-center">
                        <div className="relative w-full max-w-md">
                            <input
                                type="text"
                                placeholder="Nhập từ khóa tìm kiếm"
                                className="w-full px-4 py-2 rounded-xl border border-primary focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1 z-10 bg-primary hover:bg-primary-dark text-white p-3 rounded-full shadow"
                            >
                                <SearchIcon fontSize="medium" />
                            </button>
                        </div>
                    </div>

                    <div className={`whitespace-nowrap space-x-4 text-xs`}>
                        <Link to="/register" className="hover:text-primary font-medium">ĐĂNG KÝ</Link>
                        <span>|</span>
                        <Link to="/login" className="hover:text-primary font-medium">ĐĂNG NHẬP</Link>
                    </div>

                    <Link to="/cart" className='relative '>
                        <div className={`text-2xl text-primary cursor-pointer`}>
                            <ShoppingCartOutlinedIcon />
                        </div>
                        <div className="absolute top-0 -right-2 bg-blue-950 text-white font-semibold text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            0
                        </div>
                    </Link>
                </div>

                {/* NAVBAR & HOTLINE */}
                <div className="relative h-20 bg-cover bg-center">
                    <div className="flex justify-between items-center p-4 text-sm font-semibold">
                        {/* MENU */}
                        <nav className="flex space-x-16 items-center">
                            <Link to="/" className="bg-primary p-3 pr-10 rounded-md">
                                <div className="text-white font-semibold space-x-3 flex items-center">
                                    <DehazeOutlinedIcon />
                                    <p>DANH MỤC SẢN PHẨM</p>
                                </div>
                            </Link>
                            <div className='flex space-x-6 items-center'>
                                <Link to="/" className={isActive("/") ? "text-primary font-semibold" : "text-black"}>
                                    TRANG CHỦ
                                </Link>
                                <Link to="/about" className={isActive("/about") ? "text-primary font-semibold" : "text-black"}>
                                    GIỚI THIỆU
                                </Link>
                                <div className="relative group z-50">
                                    <Link
                                        to="/allproducts"
                                        className={isActive("/allproducts") ? "text-primary font-semibold" : "text-black"}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>SẢN PHẨM</span>
                                            <ArrowDropDownOutlinedIcon />
                                        </div>
                                    </Link>

                                    {/* Dropdown menu */}
                                    <div className="absolute left-0 mt-2 w-56 bg-white shadow-lg border border-gray-200 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-200">
                                        {["Sofa", "Ghế", "Trang trí", "Kệ sách", "Bàn", "Tủ quần áo"].map((item, index) => (
                                           <div
                                                key={index}
                                                className="px-4 py-3 text-sm text-black hover:bg-gray-100 cursor-pointer"
                                            >
                                            <div className="w-[90%] border-b border-orange-400 pl-3 pb-2">{item}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Link to="/blog" className={isActive("/blog") ? "text-primary font-semibold" : "text-black"}>
                                    TIN TỨC
                                </Link>
                                <Link to="/contact" className={isActive("/contact") ? "text-primary font-semibold" : "text-black"}>
                                    LIÊN HỆ
                                </Link>
                            </div>
                        </nav>

                        {/* HOTLINE */}
                        <div className='flex space-x-3 items-center pr-5'>
                            <div className="font-semibold flex space-x-2 items-center">
                                <HeadsetRoundedIcon className="text-primary" />
                                <p>Hotline:</p>
                            </div>
                            <div className={`text-blue-900 font-semibold text-2xl`}>
                                1900 8888
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
