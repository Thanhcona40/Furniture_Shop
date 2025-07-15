import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DehazeOutlinedIcon from '@mui/icons-material/DehazeOutlined';
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import HeadsetRoundedIcon from '@mui/icons-material/HeadsetRounded';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { initializeCart} from '../redux/actions/cartActions';
import { clearCart } from '../redux/slices/cartSlice';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { searchProducts } from '../api/product';
import NotificationBell from '../components/notification/NotificationBell';

const Header = ({ isTransparent }) => {
    const categories = ["Sofa", "Ghế", "Trang trí", "Kệ sách", "Bàn", "Tủ quần áo"];
    const user = useSelector((state) => state.auth.user)
    const { cartId, cartItems } = useSelector((state) => state.cart)
    const [openMenu, setOpenMenu] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const openCategoryMenu = Boolean(anchorEl);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Search states
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const location = useLocation();
    const currentPath = location.pathname;

    // Initialize cart when user is logged in
    useEffect(() => {
        if (user?._id && !cartId) {
            // Khởi tạo cart nếu chưa có cartId
            dispatch(initializeCart());
        }
    }, [user, cartId, dispatch]);

    // Search effect
    useEffect(() => {
        const searchTimeout = setTimeout(() => {
            if (searchKeyword.trim().length >= 2) {
                performSearch();
            } else {
                setSearchResults([]);
                setShowSearchDropdown(false);
            }
        }, 300);

        return () => clearTimeout(searchTimeout);
    }, [searchKeyword]);

    const performSearch = async () => {
        if (!searchKeyword.trim()) return;
        
        setIsSearching(true);
        try {
            const response = await searchProducts(searchKeyword);
            setSearchResults(response.data.slice(0, 5)); // Limit to 5 results
            setShowSearchDropdown(true);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchKeyword.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchKeyword.trim())}`);
            setShowSearchDropdown(false);
            setSearchKeyword('');
        }
    };

    const handleSearchItemClick = (product) => {
        navigate(`/product/${product._id}`);
        setShowSearchDropdown(false);
        setSearchKeyword('');
    };

    const handleSearchInputBlur = () => {
        // Delay hiding dropdown to allow clicking on results
        setTimeout(() => {
            setShowSearchDropdown(false);
        }, 200);
    };

    const isActive = (path) => currentPath === path;
    
    // Calculate total items in cart
    const cartItemCount = cartItems.reduce((total, item) => total + 1, 0);
    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearCart());
    }

    return (
        <header className={`w-full left-0 z-30 ${isTransparent ? "absolute" : "relative bg-white"}`}>
            <div className="relative z-10 w-9/12 mx-auto">
                {/* TOP BAR */}
                <div className={`flex items-center justify-between px-8 py-4 ${isTransparent ? 'bg-transparent' : 'bg-white'} gap-8`}>
                    <Link to="/" className={`text-2xl font-bold whitespace-nowrap flex items-center`}>
                        <span className="w-8 h-8 rounded-md bg-primary flex justify-center mr-2 text-white">🛋</span>
                        <span className="text-gray-800">Nội Thất </span>
                        <span className="text-primary"> Xinh</span>
                    </Link>
                    

                    <div className="flex-1 flex justify-center">
                        <div className="relative w-full max-w-md">
                            <form onSubmit={handleSearchSubmit}>
                                <input
                                    type="text"
                                    placeholder="Nhập từ khóa tìm kiếm"
                                    className="w-full px-4 py-2 rounded-xl border border-primary focus:outline-none"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    onFocus={() => searchKeyword.trim().length >= 2 && setShowSearchDropdown(true)}
                                    onBlur={handleSearchInputBlur}
                                />
                                <button
                                    type="submit"
                                    className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1 z-10 bg-primary hover:bg-primary-dark text-white p-3 rounded-full shadow"
                                >
                                    <SearchIcon fontSize="medium" />
                                </button>
                            </form>

                            {/* Search Dropdown */}
                            {showSearchDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                                    {isSearching ? (
                                        <div className="p-4 text-center text-gray-500">
                                            Đang tìm kiếm...
                                        </div>
                                    ) : searchResults.length > 0 ? (
                                        <>
                                            {searchResults.map((product) => (
                                                <div
                                                    key={product._id}
                                                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                                    onClick={() => handleSearchItemClick(product)}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <img
                                                            src={product.thumbnail_url || '/placeholder.jpg'}
                                                            alt={product.name}
                                                            className="w-12 h-12 object-cover rounded"
                                                        />
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-sm text-gray-900 truncate">
                                                                {product.name}
                                                            </h4>
                                                            <p className="text-sm text-gray-500">
                                                                {product.price?.toLocaleString('vi-VN')}đ
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="p-3 border-t border-gray-200">
                                                <button
                                                    onClick={handleSearchSubmit}
                                                    className="w-full text-center text-primary hover:text-primary-dark font-medium text-sm"
                                                >
                                                    Xem tất cả kết quả cho "{searchKeyword}"
                                                </button>
                                            </div>
                                        </>
                                    ) : searchKeyword.trim().length >= 2 ? (
                                        <div className="p-4 text-center text-gray-500">
                                            Không tìm thấy sản phẩm
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={`whitespace-nowrap space-x-4 text-xs`}>
                        {user ? (
                            <div className='flex space-x-3 items-center'>
                                <NotificationBell />
                                <div className='flex items-center relative'>
                                    <Link
                                        to="/account" className="hover:text-primary font-medium"
                                    >
                                        TÀI KHOẢN
                                    </Link>
                                    <ArrowDropDownOutlinedIcon className='cursor-pointer' onClick={() => setOpenMenu(!openMenu)} />
                                    {openMenu ? 
                                        (
                                        <div className="absolute top-0 left-0 z-10 mt-10 w-48 bg-white shadow-lg border border-gray-200 rounded-md">
                                            <Link to="/account" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary">
                                                Thông tin tài khoản
                                            </Link>
                                            <Link to="/account/orders_user" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary">
                                                Đơn hàng của bạn
                                            </Link>
                                            <Link to="/account/address" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary">
                                                Địa chỉ của bạn
                                            </Link>
                                            <Link to="/account/change_password" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary">
                                                Đổi mật khẩu
                                            </Link>
                                        </div>
                                        ) : (  '' )
                                    }
                                </div>
                                <span>|</span>
                                <p
                                    className='hover:text-primary font-medium cursor-pointer'
                                    onClick={handleLogout}
                                >
                                    THOÁT
                                </p>
                            </div>
                        ) : (
                            <>
                                <Link to="/register" className="hover:text-primary font-medium">ĐĂNG KÝ</Link>
                                <span>|</span>
                                <Link to="/login" className="hover:text-primary font-medium">ĐĂNG NHẬP</Link>
                            </>
                        )}
                    </div>

                    <Link to="/cart" className='relative '>
                        <div className={`text-2xl text-primary cursor-pointer`}>
                            <ShoppingCartOutlinedIcon />
                        </div>
                        {cartItemCount > 0 && (
                            <div className="absolute top-0 -right-2 bg-blue-900 text-white font-semibold text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {cartItemCount > 99 ? '99+' : cartItemCount}
                            </div>
                        )}
                    </Link>
                </div>

                {/* NAVBAR & HOTLINE */}
                <div className="relative h-20 bg-cover bg-center">
                    <div className="flex justify-between items-center p-4 text-sm font-semibold">
                        {/* MENU */}
                        <nav className="flex space-x-16 items-center">
                            <div
                              className="bg-primary p-3 pr-10 rounded-md cursor-pointer relative"
                              onClick={(e) => setAnchorEl(e.currentTarget)}
                            >
                              <div className="text-white font-semibold space-x-3 flex items-center">
                                <DehazeOutlinedIcon />
                                <p>DANH MỤC SẢN PHẨM</p>
                              </div>
                            </div>
                            <Menu
                              anchorEl={anchorEl}
                              open={openCategoryMenu}
                              onClose={() => setAnchorEl(null)}
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                              PaperProps={{
                                style: {
                                  width: '224px', // w-56
                                  marginTop: 0, // sát dưới
                                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
                                  border: '1px solid #e5e7eb',
                                },
                              }}
                              MenuListProps={{
                                sx: { padding: 0 },
                              }}
                            >
                              {categories.map((item, index) => (
                                <MenuItem
                                  key={index}
                                  onClick={() => {
                                    setAnchorEl(null);
                                    navigate(`/allproducts?category=${encodeURIComponent(item)}`);
                                  }}
                                  sx={{
                                    px: 2,
                                    py: 1.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    fontSize: '0.875rem',
                                    color: '#000',
                                    '&:hover': {
                                      backgroundColor: '#f3f4f6',
                                      color: '#ea580c', // text-primary
                                    },
                                  }}
                                >
                                  <ArrowForwardIosOutlinedIcon className='text-primary' fontSize='small' />
                                  <span className="w-[90%] pl-1">{item}</span>
                                </MenuItem>
                              ))}
                            </Menu>
                            <div className='flex space-x-6 items-center'>
                                <Link to="/" className={isActive("/") ? "text-primary font-semibold" : "text-black"}>
                                    TRANG CHỦ
                                </Link>
                                <Link to="/about" className={isActive("/about") ? "text-primary font-semibold" : "text-black"}>
                                    GIỚI THIỆU
                                </Link>
                                <div className="relative group z-40">
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
                                        {categories.map((item, index) => (
                                            <div
                                                key={index}
                                                className="px-4 py-3 text-sm text-black hover:bg-gray-100 cursor-pointer"
                                                onClick={() => {
                                                    navigate(`/allproducts?category=${encodeURIComponent(item)}`);
                                                }}
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
