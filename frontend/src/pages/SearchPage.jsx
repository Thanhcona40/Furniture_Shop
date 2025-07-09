import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchProducts } from '../api/product';
import ProductCard from '../components/product/ProductCard';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (query.trim()) {
            performSearch();
        }
    }, [query]);

    const performSearch = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await searchProducts(query);
            setSearchResults(response.data);
        } catch (err) {
            console.error('Search error:', err);
            setError('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    if (!query.trim()) {
        return (
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">
                            Tìm kiếm sản phẩm
                        </h1>
                        <p className="text-gray-600">
                            Vui lòng nhập từ khóa tìm kiếm để bắt đầu
                        </p>
                    </div>
                </div>
        );
    }

    return (
            <div className="container mx-auto max-w-[1110px] mb-5">
                {/* Search Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Kết quả tìm kiếm
                    </h1>
                    <p className="text-gray-600">
                        Tìm thấy {searchResults.length} sản phẩm cho "{query}"
                    </p>
                </div>

                {/* Search Results */}
                <div className="w-full">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-gray-600">Đang tìm kiếm...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-red-600 mb-4">{error}</p>
                            <button 
                                onClick={performSearch}
                                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
                            >
                                Thử lại
                            </button>
                        </div>
                    ) : searchResults.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 mb-4">
                                Không tìm thấy sản phẩm nào cho "{query}"
                            </p>
                            <p className="text-sm text-gray-500">
                                Thử với từ khóa khác hoặc kiểm tra chính tả
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {searchResults.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
    );
};

export default SearchPage;
