import React from 'react';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import { GoogleOutlined } from '@ant-design/icons';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerApi } from '../../api/auth';
import { ROUTES } from '../../constants';

const validateSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
  full_name: Yup.string()
    .required('Họ và tên là bắt buộc')
    .min(3, 'Tên phải có ít nhất 3 ký tự'),
  password: Yup.string()
    .required('Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Mật khẩu xác nhận không khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),
  phone: Yup.string()
    .required('Số điện thoại là bắt buộc'),
});

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const { confirm_password, ...dataToSend } = values;

    try {
      const res = await registerApi(dataToSend);
      const successMessage = res.data.message || 'Đăng ký thành công!';
      toast.success(successMessage);
      resetForm();
      
      // Chuyển hướng đến trang đăng nhập sau 1.5s
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 1500);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Đăng ký thất bại';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Formik
        initialValues={{ full_name: '', email: '', password: '', confirm_password: '', phone: '' }}
        validationSchema={validateSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="w-9/12 mx-auto py-8 space-y-6">
              <p className='font-semibold text-center text-3xl mb-5'>Đăng ký tài khoản</p>

              <div className="flex gap-2 items-center justify-center">
                <button 
                  type="button"
                  className="flex items-center gap-2 bg-[#3b5998] hover:bg-[#2d4373] text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
                  disabled
                >
                  <FacebookOutlinedIcon size={18} />
                  <span>Facebook</span>
                </button>

                <button 
                  type="button"
                  className="flex items-center gap-2 bg-[#dd4b39] hover:bg-[#c23321] text-white font-semibold py-2 px-8 rounded disabled:opacity-50"
                  disabled
                >
                  <GoogleOutlined size={18} />
                  <span>Google</span>
                </button>
              </div>

              <div className="space-y-4 flex flex-col items-center justify-center">
                <div className='w-1/3'>
                  <Field 
                    name="full_name" 
                    placeholder="Họ và tên" 
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isSubmitting}
                  />
                  <ErrorMessage name="full_name" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className='w-1/3'>
                  <Field 
                    name="email" 
                    type="email"
                    placeholder="Email" 
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isSubmitting}
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className='w-1/3'>
                  <Field 
                    name="password" 
                    type="password" 
                    placeholder="Mật khẩu" 
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isSubmitting}
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className='w-1/3'>
                  <Field 
                    name="confirm_password" 
                    type="password" 
                    placeholder="Xác nhận mật khẩu" 
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isSubmitting}
                  />
                  <ErrorMessage name="confirm_password" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className='w-1/3'>
                  <Field 
                    name="phone" 
                    placeholder="Số điện thoại" 
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isSubmitting}
                  />
                  <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <button
                  type="submit"
                  className="bg-primary text-white rounded-lg px-16 py-3 transition duration-200 hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
