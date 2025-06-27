import React from 'react';
import ProductCard from '../product/ProductCard';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import { Link, useNavigate } from 'react-router-dom';


const OutstandingProduct = ({products}) => {
    const productInitial = products?.[0] || null;
    const navigate = useNavigate()
    return (
        <div className='max-w-[1110px] max-h-[600px]  mx-auto mb-5 px-4 flex flex-col lg:flex-row gap-10'>
            <div className='lg:w-1/3 w-full border border-primary p-4 inline-block'>
                <div className="group relative selection:overflow-hidden transition-all">
                    <div className="relative w-full aspect-[2/1] min-h-[300px] bg-gray-100 overflow-hidden cursor-pointer"
                        onClick={() => navigate(`/product/${productInitial._id}`)}>
                        <img src={productInitial?.thumbnail_url} className="w-full h-full object-cover" />
                        <div className='absolute top-0 right-0 bg-primary rounded-xl text-white px-4 text-sm font-semibold'>
                            HOT
                        </div>
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
                            <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100">
                                <AddShoppingCartOutlinedIcon className="text-gray-800" />
                            </button>
                            <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100">
                                <VisibilityOutlinedIcon className="text-gray-800" />
                            </button>
                        </div>
                    </div>
                    <div className="mt-10 text-center space-y-2">
                        <h4 className="text-gray-800 text-xl font-medium">{productInitial?.name}</h4>
                        <p className="text-primary mt-1 font-medium">
                            {productInitial?.price.toLocaleString()}
                            <span className="text-xs inline-block ml-1 relative -top-1 underline "> đ</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className='lg:w-2/3 w-full'>
                <div className="relative mb-4 flex justify-between">
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-200 z-0"></div>
                    <h3 className="relative z-10 inline-block bg-primary text-xl font-normal text-white  px-4 py-2 skew-x-[-12deg]">
                        <span className="inline-block skew-x-[12deg]">SẢN PHẨM NỔI BẬT</span>
                    </h3>

                    <div className='flex text-sm font-medium space-x-3 items-center'>
                        <Link className='hover:text-primary'>Sofa</Link>
                        <Link className='hover:text-primary'>Ghế</Link>
                        <Link className='hover:text-primary'>Trang trí</Link>
                        <Link className='hover:text-primary'>Kệ sách</Link>
                        <Link className='hover:text-primary'>Bàn</Link>
                        <Link className='hover:text-primary'>Xem tất cả</Link>
                        <div>
                            <KeyboardArrowLeftOutlinedIcon className='cursor-pointer' />
                            <KeyboardArrowRightOutlinedIcon className='cursor-pointer' />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {products?.slice(1).map((item) => (
                        <ProductCard key={item.id} product={item} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default OutstandingProduct;
