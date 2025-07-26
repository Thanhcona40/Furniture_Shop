import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { deleteCategory, getCategories } from '../../../api/category';
import CategoryTable from './CategoryTable';
import EditCategory from './EditCategory';
import AddCategory from './AddCategory';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);
  const handleOpenEditModal = () => setOpenEditModal(true);
  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedCategory(null);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Lỗi tải danh mục');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleAdd = (newCategory) => {
    setCategories((prev) => [...prev, newCategory]);
    toast.success('Thêm danh mục thành công!');
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    handleOpenEditModal();
  };

  const handleSaveCategory = (updatedCategory) => {
    setCategories(categories.map(c => c._id === updatedCategory._id ? updatedCategory : c));
    toast.success('Cập nhật danh mục thành công!');
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      setCategories(categories.filter(c => c._id !== categoryId));
      toast.success('Xóa danh mục thành công!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <div className="p-6 mx-auto w-1/2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Danh mục</h1>
        <button
          onClick={handleOpenAddModal}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center"
        >
          <AddOutlinedIcon className="w-5 h-5 mr-2" />
          Thêm Danh mục
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <CategoryTable 
          categories={categories} 
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          loading={loading}
        />
      </div>

      <AddCategory 
        open={openAddModal} 
        onClose={handleCloseAddModal} 
        onAdd={handleAdd} 
      />
      
      <EditCategory 
        open={openEditModal} 
        onClose={handleCloseEditModal} 
        category={selectedCategory} 
        onSave={handleSaveCategory}
      />
    </div>
  );
};

export default CategoryManagement;