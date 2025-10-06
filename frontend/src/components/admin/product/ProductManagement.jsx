import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { deleteProduct, getProducts } from '../../../api/product';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ProductTable from './ProductTable';
import AddProduct from './AddProduct.';
import EditProduct from './EditProduct';
import useListPage from '../../../hooks/useListPage';

const ProductManagement = () => {
  const [addProductModal, setAddProductModal] = useState(false);
  const [editProductModal, setEditProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Use custom hook for list management
  const {
    data: products,
    loading,
    total,
    totalPages,
    page,
    handlePageChange,
    addItem,
    updateItem,
    removeItem,
    setData: setProducts,
  } = useListPage(() => getProducts(), {
    itemsPerPage: 10,
    initialSortBy: 'createdAt',
    initialSortOrder: 'desc',
  });

  const handleOpenAddModal = () => setAddProductModal(true);
  const handleCloseAddModal = () => setAddProductModal(false);

  const handleOpenEditModal = () => setEditProductModal(true);
  const handleCloseEditModal = () => setEditProductModal(false);

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      removeItem(productId);
      toast.success('Xóa sản phẩm thành công!');
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const handleAdd = (newProduct) => {
    addItem(newProduct);
  };

  const handleEdit = (selectProduct) => {
    setSelectedProduct(selectProduct);
    handleOpenEditModal();
  };

  const handleSave = (updatedProduct) => {
    updateItem(updatedProduct._id, updatedProduct);
    handleCloseEditModal();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Sản phẩm</h1>
        <button
          onClick={handleOpenAddModal}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center"
        >
          <AddOutlinedIcon className="w-5 h-5 mr-2" />
          Thêm Sản phẩm
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <ProductTable
          products={products}
          setProducts={setProducts}
          onDelete={handleDelete}
          onEditModal={handleEdit}
          loading={loading}
          // Pagination props
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <AddProduct
        open={addProductModal}
        onClose={handleCloseAddModal}
        onAdd={handleAdd}
      />

      <EditProduct
        open={editProductModal}
        product={selectedProduct}
        onSave={handleSave}
        onClose={handleCloseEditModal}
      />
    </div>
  );
};

export default ProductManagement;