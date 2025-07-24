import React, { useEffect, useState } from 'react';
import ProductCard from '../product/ProductCard';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { getHotProducts } from '../../api/product';

const categories = [
    { label: 'Sofa', value: 'sofa' },
    { label: 'Ghế', value: 'ghe' },
    { label: 'Trang trí', value: 'trang-tri' },
    { label: 'Kệ sách', value: 'ke-sach' },
    { label: 'Bàn', value: 'ban' },
];

const HotProduct = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getHotProducts();
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching hot products:', error);
            }
        };
        fetchProducts();
    }, []);

    const productInitial = products?.[0] || null;

    return (
        <div className='max-w-[1110px] max-h-[600px]  mx-auto mb-5 px-4 flex flex-col lg:flex-row gap-10'>
            <div className='lg:w-2/3 w-full'>
                <div className="relative mb-4 flex justify-between">
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-200 z-0"></div>
                    <h3 className="relative z-10 inline-block bg-primary text-xl font-normal text-white  px-4 py-2 skew-x-[-12deg]">
                        <span className="inline-block skew-x-[12deg]">SẢN PHẨM HOT</span>
                    </h3>

                    <div className='flex text-sm font-medium space-x-3 items-center'>
                        {categories.map(cat => (
                            <button
                                key={cat.value}
                                className={`hover:text-primary focus:outline-none`}
                                onClick={() => navigate(`/allproducts?category=${encodeURIComponent(cat.label)}`)}
                            >
                                {cat.label}
                            </button>
                        ))}
                        <button
                            className={`hover:text-primary focus:outline-none`}
                            onClick={() => navigate('/allproducts')}
                        >
                            Xem tất cả
                        </button>
                    </div>
                </div>
                <Swiper
                  spaceBetween={16}
                  slidesPerView={4}
                  autoplay={{ delay: 2000, disableOnInteraction: false }}
                  modules={[Autoplay]}
                  loop={true}
                  observer={true}
                  observeParents={true}
                  breakpoints={{
                    320: { slidesPerView: 1 },
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 4 }
                  }}
                >
                  {products.map((item) => (
                    <SwiperSlide key={item.id}>
                      <ProductCard product={item} />
                    </SwiperSlide>
                  ))}
                </Swiper>
            </div>
            <div className='lg:w-1/3 w-full border border-primary p-4 inline-block'>
                <div className="group relative selection:overflow-hidden transition-all">
                    <div className="relative w-full aspect-[2/1] min-h-[300px] bg-gray-100 overflow-hidden">
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
        </div>
    );
}

export default HotProduct;
