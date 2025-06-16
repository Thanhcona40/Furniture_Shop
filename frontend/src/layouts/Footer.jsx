import React from 'react';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const Footer = () => {
    return (
        <footer>
            {/* Dải vàng icon dịch vụ */}
            <div className="bg-primary text-white py-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="flex gap-3 items-center">
                        <LocalShippingIcon className="text-5xl mt-1" />
                        <div>
                            <div className="font-bold">GIAO HÀNG MIỄN PHÍ</div>
                            <p className="text-sm">Với đơn trên 300.000đ</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <AutorenewIcon className="text-4xl mt-1" />
                        <div>
                            <div className="font-bold">HỖ TRỢ 24/7</div>
                            <p className="text-sm">Nhanh chóng thuận tiện</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Inventory2Icon className="text-4xl mt-1" />
                        <div>
                            <div className="font-bold">ĐỔI TRẢ 3 NGÀY</div>
                            <p className="text-sm">Hấp dẫn chưa từng có</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <AssignmentTurnedInIcon className="text-4xl mt-1" />
                        <div>
                            <div className="font-bold">GIÁ TIÊU CHUẨN</div>
                            <p className="text-sm">Tiết kiệm 10% giá cả</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer chính */}
            <div className="bg-white text-gray-700 py-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Cột logo + thông tin */}
                    <div>
                        <h2 className="text-xl font-bold text-blue-700">shop furniture</h2>
                        <p className="mt-2">Siêu thị nội thất Sea Furniture</p>
                        <p className="mt-1">Trụ sở: Tòa nhà Ladeco, 266 Đội Cấn,<br />phường Liễu Giai, Ba Đình, Hà Nội</p>
                        <p className="mt-1">Hotline: 1900 6750</p>
                        <p className="mt-1">Email: seateam@gmail.com</p>
                    </div>

                    {/* Cột: Về chúng tôi */}
                    <div>
                        <h3 className="font-bold mb-2 text-primary">VỀ CHÚNG TÔI</h3>
                        <ul className="space-y-1">
                            <li>Trang chủ</li>
                            <li>Giới thiệu</li>
                            <li>Sản phẩm</li>
                            <li>Tin tức</li>
                            <li>Liên hệ</li>
                        </ul>
                    </div>

                    {/* Cột: Tin khuyến mãi */}
                    <div>
                        <h3 className="font-bold mb-2 text-primary">TIN KHUYẾN MÃI</h3>
                        <ul className="space-y-1">
                            <li>Trang chủ</li>
                            <li>Giới thiệu</li>
                            <li>Sản phẩm</li>
                            <li>Tin tức</li>
                            <li>Liên hệ</li>
                        </ul>
                    </div>

                    {/* Cột: Tổng đài + Đăng ký email */}
                    <div>
                        <h3 className="font-bold mb-2 text-primary">TỔNG ĐÀI HỖ TRỢ</h3>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-primary text-white px-2 py-1 rounded-full text-xs font-bold">24 HRS</div>
                            <span className="text-lg font-semibold">19006750</span>
                        </div>

                        <h3 className="font-bold mb-2 text-primary">NHẬN TIN KHUYẾN MÃI</h3>
                        <div className="flex space-x-3">
                            <input
                                type="email"
                                placeholder="Nhập email..."
                                className="border px-3 py-2 rounded-l w-full bg-gray-200"
                            />
                            <button
                                className="bg-primary text-white rounded-r px-5 py-2 whitespace-nowrap"
                            >
                                Đăng ký
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright cuối cùng */}
            <div className="bg-gray-800 text-white text-center py-4 text-sm">
                Bản quyền thuộc về <span className="text-orange-400 font-semibold">Sea Team</span> | Cung cấp bởi Sapo
            </div>
        </footer>

    );
}

export default Footer;
