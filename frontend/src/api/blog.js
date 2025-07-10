import {api} from '../config/api';

export const blogAPI = {
    // Lấy tất cả blog
    getAllBlogs: () => {
        return api.get('/blogs');
    },

    // Lấy blog nổi bật
    getFeaturedBlogs: () => {
        return api.get('/blogs/featured');
    },

    // Lấy blog theo ID
    getBlogById: (id) => {
        return api.get(`/blogs/${id}`);
    },

    // Tạo blog mới (Admin)
    createBlog: (blogData) => {
        return api.post('/blogs', blogData);
    },

    // Cập nhật blog (Admin)
    updateBlog: (id, blogData) => {
        return api.put(`/blogs/${id}`, blogData);
    },

    // Xóa blog (Admin)
    deleteBlog: (id) => {
        return api.delete(`/blogs/${id}`);
    }
}; 