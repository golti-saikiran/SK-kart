import React, { useState } from 'react';
import './DashBoardLayout.css';
import { NavLink, Outlet } from 'react-router-dom'; // ✅ use 'react-router-dom'
import useAuthStore from '../../Store/store';
import { UserType } from '../../utils/Types';

const DashBoard: React.FC = () => {
    const user: UserType = useAuthStore((state) => state.user);
    const [showMenu, setShowMenu] = useState(true);
    
    return (
        <div className="dashboard-container">
            <aside className={`sidebar ${showMenu?"":"hideMenu"}`}>
                <h3>Dashboard</h3>
                {user?.role === 'USER' && (
                    <>
                        <NavLink to="/dashboard/user/profile">Profile</NavLink>
                        <NavLink to="/dashboard/user/orders">Orders</NavLink>
                        <NavLink to="/dashboard/user/address">All address</NavLink>
                    </>
                )}
                {user?.role === 'ADMIN' && (
                    <>
                        <NavLink to="/dashboard/admin/manageOrders">Manage Order</NavLink>
                        <NavLink to="/dashboard/admin/categories">Categories</NavLink>
                        <NavLink to="/dashboard/admin/subCategories">Sub categories</NavLink>
                        <NavLink to="/dashboard/admin/products">Products list</NavLink>
                        <NavLink to="/dashboard/admin/product/new">Add product</NavLink>
                    </>
                )}
            </aside>
            <main className="main-content">
                <Outlet context={{ showMenu, setShowMenu }} />
            </main>
        </div>
    );
};

export default DashBoard;
