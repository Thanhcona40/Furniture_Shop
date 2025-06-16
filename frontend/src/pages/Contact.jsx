import React from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const Contact = () => {
    return (
        <div className="max-w-[1200px] mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
      
      {/* Cột bên trái: Thông tin và form */}
      <div>
        <div className="space-y-6 mb-10">
          <div className="flex items-start space-x-3">
            <LocationOnIcon className="text-orange-500 mt-1" />
            <p>
              Tòa nhà Ladeco, 266 Đội Cấn, phường Liễu Giai,<br />
              Quận Ba Đình, Hà Nội
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <PhoneIcon className="text-orange-500" />
            <p>19006750</p>
          </div>

          <div className="flex items-center space-x-3">
            <EmailIcon className="text-orange-500" />
            <p>thanh0209@gmail.com</p>
          </div>
        </div>

        {/* Form liên hệ */}
        <form className="space-y-4">
          <h2 className="text-xl font-semibold mb-2">Liên hệ</h2>
          <input
            type="text"
            placeholder="Họ và tên"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none"
          />
          <textarea
            placeholder="Nội dung"
            rows="4"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none"
          ></textarea>
          <button
            type="submit"
            className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 transition"
          >
            Gửi liên hệ
          </button>
        </form>
      </div>

      {/* Cột bên phải: Bản đồ */}
      <div className="w-full h-[400px]">
        <iframe
          title="Google Map"
          className="w-full h-full rounded-md"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.260083901374!2d105.78120017510117!3d21.022738187768254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab3f1f81ec5d%3A0xf811f5fa786dc0e4!2zMzAgxJAuIFBo4bqhbSBWxINuIMSQw7RuZywgTWFpIMSQw6xjaCwgQ8OhbSBHaWF5LCBIw6AgTuG7mWksIFZpZXRuYW0!5e0!3m2!1svi!2s!4v1718423123456!5m2!1svi!2s"
          loading="lazy"
        ></iframe>
      </div>
    </div>
    );
}

export default Contact;
