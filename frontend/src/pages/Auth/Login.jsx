import React, { useEffect } from 'react';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import { GoogleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { loginApi } from '../../api/auth';
import { toast } from 'react-toastify';
import { loginSuccess } from '../../redux/slices/authSlice';

const validateSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
  password: Yup.string()
    .required('Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Clear justLoggedOut flag when component mounts
  useEffect(() => {
    sessionStorage.removeItem('justLoggedOut');
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const res = await loginApi(values);
      const { token, user } = res.data;
      dispatch(loginSuccess({ token, user }));
      toast.success('Đăng nhập thành công!');
      user.role === 'admin' ? navigate('/admin') : navigate('/');
      resetForm();
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  return (
    <div>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validateSchema}
        onSubmit={handleSubmit}
      >
        <Form className="w-9/12 mx-auto py-8 space-y-6">
          <p className="font-semibold text-center text-3xl mb-5">
            Đăng nhập tài khoản
          </p>

          <div className="flex gap-2 items-center justify-center">
            <button
              type="button"
              className="flex items-center gap-2 bg-[#3b5998] hover:bg-[#2d4373] text-white font-semibold py-2 px-4 rounded"
            >
              <FacebookOutlinedIcon size={18} />
              <span>Facebook</span>
            </button>

            <button
              type="button"
              className="flex items-center gap-2 bg-[#dd4b39] hover:bg-[#c23321] text-white font-semibold py-2 px-8 rounded"
            >
              <GoogleOutlined size={18} />
              <span>Google</span>
            </button>
          </div>

          <div className="space-y-4 flex flex-col items-center justify-center">
            <div className="w-1/3">
              <Field name="email" placeholder="Email" className="w-full border p-2" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="w-1/3">
              <Field name="password" type="password" placeholder="Mật khẩu" className="w-full border p-2" />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>

            <button
              type="submit"
              className="bg-primary text-white rounded-lg px-12 py-2 transition duration-200"
            >
              Đăng nhập
            </button>
          </div>

          <p className="text-center text-gray-500">
            Bạn chưa có tài khoản, vui lòng đăng ký
            <Link to="/register" className="underline cursor-pointer"> tại đây</Link>
          </p>
        </Form>
      </Formik>
    </div>
  );
};

export default Login;
