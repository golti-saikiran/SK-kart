import './NavBar.css'
import { FaShoppingCart } from "react-icons/fa";
import SearchBar from './SearchBar/SearchBar';
import { useState } from 'react';
import UserMenu from './UserMenu/Menu';
import Logo from './Logo/Logo';
import { useNavigate } from 'react-router';
import useStore from '../../Store/store';

const NavBar = () => {
    const [searchValue, setSearchValue] = useState('')
    const navigate = useNavigate();
    const user = useStore((state) => state.user)
    const isAuthanticated = useStore((state) => state.isAuthenticate)
    const cart = user.shopping_cart

    return (
        <div className="NavContainer">
            <Logo />

                <SearchBar
                    value={searchValue}
                    setValue={setSearchValue}
                />
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
