import logo from './logo.svg';
import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import React, { use, useEffect, useState } from 'react';
import { checkAuthenticated } from './utils/AuthUtil';
import Login from './pages/Login';
import Register from './pages/Register';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import About from './pages/About';
import SearchPage from './pages/SearchPage';
import AddressPage from './pages/AddressPage';
import Blog from './pages/Blog';
import Cart from './pages/Cart';
import ProfilePageLayout from './components/profile/ProfilePageLayout';
import Profile from './pages/Profile';
import Order from './pages/Order';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import AdminLayout from './components/admin/AdminLayout';
import Product from './pages/Product';
import ProductListPage from './pages/ProductListPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/admin/Dashboard';
import UserManagement from './components/admin/UserManagement';
import OrderManagement from './components/admin/OrderManagement';
import ProductManagement from './components/admin/product/ProductManagement';
import CategoryManagement from './components/admin/category/CategoryManagement';

function App() {

  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await checkAuthenticated();
      setIsAuthenticated(authenticated);
    }
    checkAuth();
  }, [location.pathname]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }
  window.scrollTo(0, 0);
  return (
    <>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="orders" element={<OrderManagement />} />
        </Route>
        <Route path='/' element={<MainLayout />}>
          <Route path='' element={<HomePage />} />
          <Route path='about' element={<About />} />
          <Route path='blog' element={<Blog />} />
          <Route path='cart' element={<Cart />} />
          <Route path='account' element={<ProfilePageLayout />}>
            <Route path='profile' element={<Profile />} />
            <Route path='address' element={<AddressPage />} />
            <Route exact path='orders' element={<Order />} />
          </Route>
          <Route path='search' element={<SearchPage />} />
          <Route path='contact' element={<Contact />} />
          <Route path='checkout' element={<Checkout />} />
          <Route path='product/:productInfo' element={<Product />} />
          <Route path='allproducts' element={<ProductListPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Route>
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

export default App;
