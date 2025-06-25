import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getCategories } from '../../../api/category';
import { addProduct } from '../../../api/product';
import { Modal } from '@mui/material';
import { uploadToCloudinary } from '../../../utils/uploadToCloudinary'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

const AddProduct = ({ onAdd, open, onClose }) => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    description: '',
    stock_quantity: 0,
    thumbnail_url: '',
    sold: 0,
    total_reviews: 0,
    category_id: '',
  });
  const [categories, setCategories] = useState([]);
  const [selectedImage, setSelectedImage] = useState("")
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        toast.error('Lỗi xảy ra');
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (event) => {
    event.stopPropagation()
    setUploading(true)
    const file =  await uploadToCloudinary(event.target.files[0])
    setSelectedImage(file); 
    setNewProduct({...newProduct, thumbnail_url: file})
    setUploading(false)
  }

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await addProduct(newProduct);
      onAdd(response.data);
      onClose()
      setNewProduct({
        name: '',
        price: 0,
        description: '',
        stock_quantity: 0,
        thumbnail_url: '',
        sold: 0,
        total_reviews: 0,
        category_id: '',
      });
      setSelectedImage('')
      toast.success('Thêm sản phẩm thành công!');
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
          <div className="border-b border-gray-200 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Thêm sản phẩm mới</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <CloseOutlinedIcon className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleAddProduct} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
                <input
                  type="text"
                  name="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                   onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₫</span>
                  <input
                    type="number"
                    name="price"
                    className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  name="description"
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng tồn kho</label>
                <input
                  type="number"
                  name="stock_quantity"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                <select
                  name="category_id"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  onChange={handleInputChange}
                  >
                  <option value="">Chọn danh mục</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh đại diện</label>
                <div className="mt-1 flex items-center">
                  <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    Chọn ảnh
                    <input type="file" className="sr-only" onChange={handleImageChange} />
                  </label>
                  {selectedImage && (
                    <img src={selectedImage} alt="Preview" className="ml-4 h-16 w-16 object-cover rounded" />
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Thêm sản phẩm
              </button>
            </div>
          </form>
        </div>
      </div>
</Modal >
  );
};

export default AddProduct;