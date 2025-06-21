import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    return (
        <div className="flex">
            <div className="flex-1 ml-64">
                <Outlet />
            </div>
        </div>
    );
}

export default AdminLayout;
