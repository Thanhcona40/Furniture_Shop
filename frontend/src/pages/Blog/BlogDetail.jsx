import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogAPI } from '../../api/blog';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BlogDetail = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogDetail = async () => {
            try {
                setLoading(true);
                const response = await blogAPI.getBlogById(id);
                setBlog(response.data);
            } catch (error) {
                console.error('Error fetching blog detail:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-[1110px] mx-auto my-5 p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="max-w-[1110px] mx-auto my-5 p-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy bài viết</h2>
                    <Link to="/blog" className="text-primary hover:text-primary-dark">
                        Quay lại trang blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1110px] mx-auto my-5 p-6">
            <div className="mb-6">
                <Link 
                    to="/blog" 
                    className="inline-flex items-center text-primary hover:text-primary-dark mb-4"
                >
                    <ArrowBackIcon className="w-5 h-5 mr-2" />
                    Quay lại trang blog
                </Link>
            </div>

            <article className="bg-white rounded-lg shadow-lg overflow-hidden">
                {blog.image && (
                    <div className="w-full h-96 overflow-hidden">
                        <img 
                            src={blog.image} 
                            alt={blog.title} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="p-8">
                    <header className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">{blog.title}</h1>
                        <div className="flex items-center text-gray-600 text-sm mb-4">
                            <EventAvailableOutlinedIcon className="w-4 h-4 mr-2" />
                            <span>{new Date(blog.datePosted).toLocaleDateString('vi-VN')}</span>
                            <span className="mx-2">•</span>
                            <span>Đăng bởi: {blog.author}</span>
                        </div>
                    </header>

                    <div className="prose prose-lg max-w-none">
                        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {blog.content}
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default BlogDetail; 