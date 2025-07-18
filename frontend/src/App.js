import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import About from './pages/About';
import SearchPage from './pages/SearchPage';
import Blog from './pages/Blog/Blog';
import BlogDetail from './pages/Blog/BlogDetail';
import Cart from './pages/Cart';
import ProfilePageLayout from './layouts/ProfilePageLayout';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import AdminLayout from './components/admin/AdminLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/admin/dashboard/Dashboard';
import UserManagement from './components/admin/user/UserManagement';
import OrderManagement from './components/admin/order/OrderManagement';
import ProductManagement from './components/admin/product/ProductManagement';
import CategoryManagement from './components/admin/category/CategoryManagement';
import BlogManagement from './components/admin/blog/BlogManagement';
import ProductListPage from './pages/ProductPage/ProductListPage';
import ProductDetail from './pages/ProductPage/ProductDetail';
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import PublicRoute from "./routes/PublicRoute";
import Profile from './pages/AccountPage/Profile';
import Order from './pages/AccountPage/Order';
import AddressPage from './pages/AccountPage/AddressPage';
import ChangePassword from './pages/AccountPage/ChangePassword';
import { WebSocketProvider } from './contexts/WebSocketContext';
import PaymentResult from './pages/PaymentResult';

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <WebSocketProvider>
      <Routes>
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="blogs" element={<BlogManagement />} />
          <Route path="orders" element={<OrderManagement />} />
        </Route>
        <Route path='/' element={<MainLayout />}>
          <Route path='' element={<HomePage />} />
          <Route path='about' element={<About />} />
          <Route path='blog' element={<Blog />} />
          <Route path='blog/:id' element={<BlogDetail />} />
          <Route path='cart' element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path='account' element={<PrivateRoute><ProfilePageLayout /></PrivateRoute>}>
            <Route index element={<Profile />} />
            <Route path='address' element={<AddressPage />} />
            <Route path='orders_user' element={<Order />} />
            <Route path='change_password' element={<ChangePassword />} />
          </Route>
          <Route path='search' element={<SearchPage />} />
          <Route path='contact' element={<Contact />} />
          <Route path='product/:id' element={<ProductDetail />} />
          <Route path='allproducts' element={<ProductListPage />} />
          <Route path='login' element={<PublicRoute><Login /></PublicRoute>} />
          <Route path='register' element={<PublicRoute><Register /></PublicRoute>} />
        </Route>
        <Route path='/checkout' element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path='/payment-result' element={<PaymentResult />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </WebSocketProvider>
  );
}

export default App;
