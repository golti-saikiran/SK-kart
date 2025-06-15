import './NavBar.css'
import { FaShoppingCart } from "react-icons/fa";
import { MdOutlineSearch } from "react-icons/md";
import UserMenu from './UserMenu/Menu';
import Logo from './Logo/Logo';
import { useNavigate } from 'react-router';
import useStore from '../../Store/store';
import { useLocation } from 'react-router';

const NavBar = () => {
    const navigate = useNavigate();
    const user = useStore((state) => state.user)
    const isAuthanticated = useStore((state) => state.isAuthenticate)
    const cart = user.shopping_cart
    const location = useLocation()
    const handleOnFocus = () => {
        navigate('/search');
    };

    return (
        <div className="NavContainer">
            <Logo />
            {location.pathname !== '/search' &&
                <div className="searchbar" onClick={handleOnFocus}>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search..."
                        onFocus={handleOnFocus}
                        style={{ width: "200px" }}
                    />
                    <button className="search-button">
                        <MdOutlineSearch />
                    </button>
                </div>
            }

            <div className="right-nav-menu">
                {isAuthanticated &&
                    <div className='cart-container' onClick={() => navigate('/cart')}>
                        <FaShoppingCart className='cart-icon' />
                        <span>{cart?.length}</span>
                    </div>}

                <UserMenu />
            </div>

        </div>
    )
}

export default NavBar
