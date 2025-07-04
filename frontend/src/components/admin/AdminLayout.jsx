import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 ml-64 p-6 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;
