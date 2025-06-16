import React, { useState } from 'react';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { InputNumber } from 'antd';
import { Link } from 'react-router-dom';

const Cart = () => {
    const [cart, setCart] = useState([{
        id: 1,
        name: "Ghế Luxury",
        price: 1500000,
        amount: 1,
        image:"https://bizweb.dktcdn.net/thumb/large/100/364/402/products/2-042bbb81b1b64e5287a9a94736f714bf-master.jpg?v=1566961266430"
    }, {
        id: 2,
        name: "Tủ giày Hobu",
        price: 1200000,
        amount: 3,
        image: "https://bizweb.dktcdn.net/thumb/large/100/364/402/products/30-do-2021fed95b944be3873d99cbd3dd93ff-master.jpg?v=1566960549770"

    }]); // 

    const handleAmountChange = (value, id) => {
        const newAmount = value || 1;
        setCart((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, amount: newAmount } : item
            )
        );
    };
    return (
        <div className='mx-auto w-9/12 py-8 space-y-6'>
           <p className='font-semibold text-3xl mb-5'>Giỏ hàng của bạn</p>
           <div className="border border-primary">
            {cart.length > 0 ? (
                    <ul>
                        <li>
                            <div className="flex items-center py-2 px-4 font-semibold">
                                <span className='w-1/2 pt-4 pl-5'>Sản phẩm</span>
                                <div className='flex w-1/2 pt-4 justify-between items-center'>
                                    <span>Giá</span>
                                    <span>Số lượng</span>
                                    <span className='pr-5'>Tổng</span>
                                </div>
                            </div>

                            <div className="w-[95%] border-b border-primary mx-auto" />
                        </li>

                        {cart.map((item, index) => (
                            <li key={index} className="flex items-center px-4 py-2">
                                <span className='w-1/2 pt-4 pl-5 flex items-center space-x-3'>
                                    <ClearOutlinedIcon className='cursor-pointer text-gray-500' fontSize='small' />
                                    <img src={item.image} alt={item.name} className='w-20 h-20 inline-block mr-2' />
                                    <p className='text-gray-500'>{item.name}</p>
                                </span>
                                <div className='flex w-1/2 pt-4 justify-between items-center'>
                                    <span>
                                        {item.price.toLocaleString('vi-VN')} 
                                        <span className="text-xs inline-block ml-1 relative -top-1 underline "> đ </span>
                                    </span>
                                     <InputNumber
                                        min={1}
                                        value={item.amount}
                                        onChange={(value) => handleAmountChange(value, item.id)}
                                    />
                                    <span className='pr-5'>
                                        {(item.price * item.amount).toLocaleString('vi-VN')} 
                                        <span className="text-xs inline-block ml-1 relative -top-1 underline "> đ </span>
                                    </span>
                                </div>
                            </li>
                        ))}
                         {/* Border dưới chiếm 80% */}
                        <div className="w-[95%] border-b mt-5 border-gray-200 mx-auto" />
                        <div className='flex justify-end items-center py-4 pr-5 space-x-10'>
                            <span className='font-semibold text-xl py-3'>Tổng số thành tiền:</span>
                            <span className='text-primary font-semibold text-xl'>
                                {cart.reduce((total, item) => total + item.price * item.amount, 0).toLocaleString('vi-VN')}
                                <span className="text-xs inline-block ml-1 relative -top-1 underline "> đ </span>
                            </span>
                        </div>
                        <div className='flex justify-end items-center py-4 pr-5 space-x-10'>
                            <Link to="/allproducts" className='bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition'>
                                Tiếp tục mua sắm
                            </Link>
                            <button className='bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition'>
                                Tiến hành thanh toán
                            </button>
                        </div>
                    </ul>
                ) : (
                <p className='p-5'>Không có sản phẩm nào trong giỏ hàng. Quay lại cửa hàng để tiếp tục mua sắm.</p>
            )}
            </div>
        </div>
    );
}

export default Cart;
