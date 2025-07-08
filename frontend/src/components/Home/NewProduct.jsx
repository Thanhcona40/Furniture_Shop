import React from 'react';
import ProductCard from '../product/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';

const categories = [
    { label: 'Sofa', value: 'sofa' },
    { label: 'Ghế', value: 'ghe' },
    { label: 'Trang trí', value: 'trang-tri' },
    { label: 'Kệ sách', value: 'ke-sach' },
    { label: 'Bàn', value: 'ban' },
];

const NewProduct = ({products}) => {
    const navigate = useNavigate();
    return (
        <div className='max-w-[1110px] max-h-[600px]  mx-auto mb-5 px-4 flex flex-col lg:flex-row gap-10'>
            <div className='w-full'>
                <div className="relative mb-4 flex justify-between">
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-200 z-0"></div>
                    <h3 className="relative z-10 inline-block bg-primary text-xl font-normal text-white  px-4 py-2 skew-x-[-12deg]">
                        <span className="inline-block skew-x-[12deg]">SẢN PHẨM MỚI VỀ</span>
                    </h3>
                    <div className='flex text-sm font-medium space-x-3 items-center'>
                        {categories.map(cat => (
                            <button
                                key={cat.value}
                                className='hover:text-primary focus:outline-none'
                                onClick={() => navigate(`/allproducts?category=${encodeURIComponent(cat.label)}`)}
                            >
                                {cat.label}
                            </button>
                        ))}
                        <button
                            className='hover:text-primary focus:outline-none'
                            onClick={() => navigate('/allproducts')}
                        >
                            Xem tất cả
                        </button>
                    </div>
                </div>
                <Swiper
                  spaceBetween={16}
                  slidesPerView={5}
                  autoplay={{ delay: 2000, disableOnInteraction: false }}
                  modules={[Autoplay]}
                  loop={true}
                  observer={true}
                  observeParents={true}
                  breakpoints={{
                    320: { slidesPerView: 1 },
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 5 }
                  }}
                >
                  {products?.slice(1).map((item) => (
                    <SwiperSlide key={item._id || item.id}>
                      <ProductCard product={item} />
                    </SwiperSlide>
                  ))}
                </Swiper>
            </div>
        </div>
    );
}

export default NewProduct;
