import { NavLink } from 'react-router-dom';
import { FaCircleUser } from "react-icons/fa6";
import useStore from "../../../Store/store";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const MenuList = () => {
    const setIsAuthenticate = useStore(state => state.setIsAuthenticate);
    const user = useStore(state => state.user);
    const clearUser = useStore(state => state.clearUser);
    const navigate = useNavigate()

  const handleLogout = () => {
        setIsAuthenticate(false);
        clearUser()
        localStorage.removeItem('app-store-storage');
        localStorage.removeItem('token');
        toast("Logout successfully")
        navigate('/login')
    }
    return (
        <div>
            <ul className="user-menu-list">
                <div className="user-profile">
                    {user?.avatar ? <img src={user?.avatar} alt='user-image' className='user-menu-logo' /> : <FaCircleUser className="user-menu-logo" />}
                    <span>{user?.name ? user.name : "Guest"}</span>
                </div>
                {user?.role === 'USER' && <>
                    <li><NavLink to='/dashboard/user/profile'>Profile</NavLink></li>
                    <li><NavLink to='/dashboard/user/orders'>Orders</NavLink></li>
                    <li><NavLink to='/dashboard/user/address'>My Address</NavLink></li>
                </>
                }
                {user?.role === 'ADMIN' && <>
                    <li> <NavLink to="/dashboard/admin/manageOrders">Manage Order</NavLink></li>
                    <li> <NavLink to="/dashboard/admin/categories">Categories</NavLink></li>
                    <li><NavLink to="/dashboard/admin/subCategories">Sub categories</NavLink></li>
                    <li> <NavLink to="/dashboard/admin/products">Products list</NavLink></li>
                    <li> <NavLink to="/dashboard/admin/product/new">Add product</NavLink></li>
                </>
                }
                <li onClick={() => handleLogout()}><span>Logout</span></li>
            </ul>
        </div>
    )
}

export default MenuList
