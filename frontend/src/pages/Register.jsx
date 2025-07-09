import React from 'react';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import { GoogleOutlined } from '@ant-design/icons';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { registerApi } from '../api/auth';
import { toast } from 'react-toastify';

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

  const handleSubmit = async (values, { resetForm }) => {
    const { confirm_password, ...dataToSend } = values;

    try {
      const res = await registerApi(dataToSend);
      toast.success('Đăng ký thành công!');
      resetForm();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <div>
      <Formik
        initialValues={{ full_name: '', email: '', password: '', confirm_password: '', phone: '' }}
        validationSchema={validateSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="w-9/12 mx-auto py-8 space-y-6">
            <p className='font-semibold text-center text-3xl mb-5'>Đăng ký tài khoản</p>

            <div className="flex gap-2 items-center justify-center">
              <button className="flex items-center gap-2 bg-[#3b5998] hover:bg-[#2d4373] text-white font-semibold py-2 px-4 rounded">
                <FacebookOutlinedIcon size={18} />
                <span>Facebook</span>
              </button>

              <button className="flex items-center gap-2 bg-[#dd4b39] hover:bg-[#c23321] text-white font-semibold py-2 px-8 rounded">
                <GoogleOutlined size={18} />
                <span>Google</span>
              </button>
            </div>

            <div className="space-y-4 flex flex-col items-center justify-center">
              <div className='w-1/3'>
                <Field name="full_name" placeholder="Họ và tên" className="w-full border p-2" />
                <ErrorMessage name="full_name" component="div" className="text-red-500 text-sm" />
              </div>

              <div className='w-1/3'>
                <Field name="email" placeholder="Email" className="w-full border p-2" />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              </div>

              <div className='w-1/3'>
                <Field name="password" type="password" placeholder="Mật khẩu" className="w-full border p-2" />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
              </div>

              <div className='w-1/3'>
                <Field name="confirm_password" type="password" placeholder="Xác nhận mật khẩu" className="w-full border p-2" />
                <ErrorMessage name="confirm_password" component="div" className="text-red-500 text-sm" />
              </div>

              <div className='w-1/3'>
                <Field name="phone" placeholder="Số điện thoại" className="w-full border p-2" />
                <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
              </div>

              <button
                type="submit"
                className="bg-primary text-white rounded-lg px-16 py-3 transition duration-200"
              >
                Đăng ký
              </button>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default Register;
