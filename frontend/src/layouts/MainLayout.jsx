import React from 'react';
import Header from './Header';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';

import Breadcrumbs from './Breadcrumbs';

const MainLayout = () => {

    const location = useLocation();
    const isHomePage = location.pathname === "/";

    return (
        <div className='relative'>
            <Header isTransparent={isHomePage}/>
            {!isHomePage && (
                <Breadcrumbs location={location.pathname} />
            )}
            {/* Nội dung từng trang */}
            <div className={`${!isHomePage ? "pt-8" : ""}  relative z-10`}>
                <Outlet />
            </div>
            <Footer/>
        </div>
    );
}

export default MainLayout;
