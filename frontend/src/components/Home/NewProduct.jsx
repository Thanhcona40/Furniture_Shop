import React from 'react';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import ProductCard from '../product/ProductCard';
import products from '../product/product';

const NewProduct = () => {
    const productInitial = products[0];
    return (
        <div className='max-w-[1110px] max-h-[600px]  mx-auto mb-5 px-4 flex flex-col lg:flex-row gap-10'>
            <div className='w-full'>
                <div className="relative mb-4 flex justify-between">
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-200 z-0"></div>
                    <h3 className="relative z-10 inline-block bg-primary text-xl font-normal text-white  px-4 py-2 skew-x-[-12deg]">
                        <span className="inline-block skew-x-[12deg]">SẢN PHẨM MỚI VỀ</span>
                    </h3>

                    <div className='flex text-sm font-medium space-x-3 items-center'>
                        <div>
                            <KeyboardArrowLeftOutlinedIcon className='cursor-pointer' />
                            <KeyboardArrowRightOutlinedIcon className='cursor-pointer' />
                        </div>
                    </div>
                </div>
                <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {products.slice(1).map((item) => (
                        <ProductCard key={item.id} product={item} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default NewProduct;
