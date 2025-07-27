import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { deleteProduct, getProducts } from '../../../api/product';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ProductTable from './ProductTable';
import AddProduct from './AddProduct.';
import EditProduct from './EditProduct';

const ProductManagement = () => {
  const [addProductModal, setAddProductModal] = useState(false);
  const [editProductModal, setEditProductModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleOpenAddModal = () => setAddProductModal(true);
  const handleCloseAddModal = () => setAddProductModal(false);

  const handleOpenEditModal = () => setEditProductModal(true);
  const handleCloseEditModal = () => setEditProductModal(false);

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      setProducts(products.filter((p) => p._id !== productId));
      toast.success('Xóa sản phẩm thành công!');
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const handleAdd = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  const handleEdit = (selectProduct) => {
    setSelectedProduct(selectProduct);
    handleOpenEditModal();
  };

  const handleSave = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
    );
    handleCloseEditModal();
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (err) {
        toast.error(err?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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