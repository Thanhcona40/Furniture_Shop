import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import { blogAPI } from '../../api/blog';
const GoodTrick = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchFeaturedBlogs = async () => {
            try {
                const response = await blogAPI.getFeaturedBlogs();
                setBlogs(response.data);
            } catch (error) {
                console.error('Error fetching featured blogs:', error);
            }
        };
        fetchFeaturedBlogs();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <div className='max-w-[1110px] mx-auto my-5 relative'>
            <div className="relative mb-4">
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-200 z-0"></div>
                <h3 className="relative z-10 inline-block bg-primary text-white text-xl font-normal px-4 py-2 skew-x-[-12deg]">
                    <span className="inline-block skew-x-[12deg]">MẸO VẶT HAY</span>
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
                {blogs.map((blog) => (
                    <div key={blog._id} className="border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                        <Link to={`/blog/${blog._id}`}>
                            <img src={blog.image} alt={blog.title} className="w-full h-52 object-cover" />
                            <div className="relative z-10 flex justify-center space-x-3 items-center py-3 bg-white">
                                <p className="text-xs font-semibold flex items-center">
                                    <EventAvailableOutlinedIcon fontSize="small" />
                                    {formatDate(blog.datePosted)}
                                </p>
                                <p className="text-xs font-semibold">
                                    <span className="font-normal text-xs">Đăng bởi:</span> {blog.author}
                                </p>

                            </div>
                            <div className="p-4 bg-gray-100 z-10 relative">
                                <h4 className="text-lg flex justify-start font-semibold mb-2">{blog.title}</h4>
                                <p className="text-gray-600 text-sm mb-2 truncate">{blog.content}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GoodTrick;
