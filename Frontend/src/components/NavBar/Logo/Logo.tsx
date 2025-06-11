import { NavLink } from "react-router"
import useAuthStore from "../../../Store/store"
import LightLogo from '../../../Assets/LightLogo.png'
import DarkLogo from '../../../Assets/DarkLogo.png'
import './Logo.css'

const Logo = () => {
    const theme = useAuthStore(state => state.theme);
    return (
        <div className='logo'>
            <NavLink to='/'> <img src={theme === 'Dark' ? DarkLogo : LightLogo} alt='website logo ' /></NavLink>
        </div>
    )
}

export default Logo

