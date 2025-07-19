import banner from '../assets/banner.jpg'; 
import CategoryMenu from '../layouts/CategoryMenu';
import OutstandingProduct from '../components/Home/OutstandingProduct';
import HotProduct from '../components/Home/HotProduct';
import NewProduct from '../components/Home/NewProduct';
import GoodTrick from '../components/Home/GoodTrick';
import { useEffect, useState } from 'react';
import { getProducts } from '../api/product';
import {toast} from 'react-toastify'
import CircularProgress from '@mui/material/CircularProgress';


const HomePage = () => {
    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState(null)
    
    useEffect(() => {
        if (!products?.length) {
        const fetchProducts = async () => {
            try {
            const response = await getProducts();
            setProducts(response.data);
            setLoading(false);
            } catch (err) {
            toast.error(err?.response?.data?.message);
            setLoading(false);
            }
        };
        fetchProducts();
        } else {
        setLoading(false);
        }
    }, [products]);

    if (loading) return <div className="flex justify-center"><CircularProgress /></div>;

    return (
        <>
            <div className="relative h-screen">
                <img
                    src={banner}
                    alt="banner"
                    className="absolute top-0 left-0 w-full h-full object-cover z-0"
                />

                <div className='absolute left-1/2 bottom-0 translate-x-[-50%] translate-y-1/2 flex mx-auto w-max text-center z-10 bg-white'>
                    <CategoryMenu />
                </div>
            </div>

            <div className="mt-32">
                <OutstandingProduct products={products}/>
            </div>

            <div className='flex max-w-[1110px] mx-auto my-16 px-4 gap-3'>
                <div className="relative overflow-hidden group cursor-pointer w-full h-64">
                    {/* Ảnh */}
                    <img
                        src="https://bizweb.dktcdn.net/100/364/402/themes/857456/assets/banner_1.jpg?1706113259748"
                        alt="Phòng bếp"
                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Lớp phủ tối mờ */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500"></div>

                    {/* Text trung tâm */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/60 px-6 py-2">
                            <h3 className="text-lg font-semibold text-gray-800">PHÒNG KHÁCH</h3>
                        </div>
                    </div>
                </div>
                <div className="relative overflow-hidden group cursor-pointer w-full h-64">
                    {/* Ảnh */}
                    <img
                        src="https://bizweb.dktcdn.net/100/364/402/themes/857456/assets/banner_2.jpg?1706113259748"
                        alt="Phòng bếp"
                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Lớp phủ tối mờ */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-500"></div>

                    {/* Text trung tâm */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/60 px-6 py-2">
                            <h3 className="text-lg font-semibold text-gray-800">PHÒNG BẾP</h3>
                        </div>
                    </div>
                </div>
            </div>

            <HotProduct products={products}/>

            <div className='relative overflow-hidden group cursor-pointer max-w-[1110px] mx-auto my-16 px-4'>
                <img 
                    src="https://bizweb.dktcdn.net/100/364/402/themes/857456/assets/banner.jpg?1706113259748" 
                    alt="Sale" 
                    className='w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105'/>
            </div>

            <NewProduct products={products}/>

            <div className='mb-10'>
                <GoodTrick/>
            </div>
        </>
    );
}

export default HomePage;
