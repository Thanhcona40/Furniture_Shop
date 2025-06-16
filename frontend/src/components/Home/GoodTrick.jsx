import React from 'react';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';

const blogs = [
    {
        id: 1,
        title: "Blog Post 1",
        content: "This is the content of blog post 1.",
        datePosted: "2023-10-01",
        author: "Author Name",
        image: "https://bizweb.dktcdn.net/thumb/large/100/364/402/articles/blog-grid-11.jpg?v=1566957209953"
    },
    {
        id: 2,
        title: "Blog Post 2",
        content: "This is the content of blog post 2.",
        datePosted: "2023-10-01",
        author: "Author Name",
        image: "https://bizweb.dktcdn.net/thumb/large/100/364/402/articles/blog-grid-11.jpg?v=1566957209953"
    },
    {
        id: 3,
        title: "Blog Post 3",
        content: "This is the content of blog post 3. It contains more information about the topic.It is designed to be informative and engaging for readers. It includes various details and insights that are relevant to the subject matter.",
        datePosted: "2023-10-01",
        author: "Author Name",
        image: "https://bizweb.dktcdn.net/thumb/large/100/364/402/articles/blog-grid-11.jpg?v=1566957209953"
    }
];
const GoodTrick = () => {

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
                    <div key={blog.id} className="border border-gray-200 overflow-hidden">
                        <img src={blog.image} alt={blog.title} className="w-full h-52 object-cover" />
                        <div className="relative z-10 flex justify-center space-x-3 items-center py-3 bg-white">
                            <p className="text-xs font-semibold flex items-center">
                                <EventAvailableOutlinedIcon fontSize="small" />
                                {blog.datePosted}
                            </p>
                            <p className="text-xs font-semibold">
                                <span className="font-normal text-xs">Đăng bởi:</span> {blog.author}
                            </p>

                        </div>
                        <div className="p-4 bg-gray-100 z-10 relative">
                            <h4 className="text-lg flex justify-start font-semibold mb-2">{blog.title}</h4>
                            <p className="text-gray-600 text-sm mb-2 truncate">{blog.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GoodTrick;
