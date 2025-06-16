import React from 'react';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import { GoogleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Login = ({isAuthenticated}) => {
    return (
        <div>
            <form action="" method="post">
                <div className="w-9/12 mx-auto py-8 space-y-6">
                    <p className='font-semibold text-center text-3xl mb-5'>Đăng nhập tài khoản</p>

                    <div className="flex gap-2 items-center justify-center">
                    {/* Facebook */}
                    <button className="flex items-center gap-2 bg-[#3b5998] hover:bg-[#2d4373] text-white font-semibold py-2 px-4 rounded">
                        <FacebookOutlinedIcon size={18} />
                        <span>Facebook</span>
                    </button>

                    {/* Google */}
                    <button className="flex items-center gap-2 bg-[#dd4b39] hover:bg-[#c23321] text-white font-semibold py-2 px-8 rounded">
                        <GoogleOutlined  size={18} />
                        <span>Google</span>
                    </button>
                    </div>

                    <div className="space-y-4 flex flex-col items-center justify-center">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="p-3 w-1/3 border border-gray-300 focus:outline-none"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            className="p-3 w-1/3 border border-gray-300 focus:outline-none"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-primary text-white rounded-lg px-12 py-2 transition duration-200"
                        >
                            Đăng nhập
                        </button>
                    </div>
                    <p className='text-center text-gray-500'>
                        Bạn chưa có tài khoản, vui lòng đăng ký 
                        <Link to="/register" className='underline cursor-pointer'> tại đây</Link>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default Login;
