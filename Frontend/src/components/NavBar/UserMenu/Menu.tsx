import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { RiLoginBoxFill } from "react-icons/ri";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // corrected import
import useStore from "../../../Store/store";
import './Menu.css';
import MenuList from "./MenuList";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const isAuthenticate = useStore(state => state.isAuthenticate);
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='user-menu-container' ref={menuRef}>
      {isAuthenticate ? (
        <>
          <div className="user-menu-button" onClick={() => setIsOpen(!isOpen)}>
            <span>Account</span>
            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {isOpen && <MenuList />}
        </>
      ) : (
        <button onClick={() => navigate('/login')} className='login-btn'>
          <RiLoginBoxFill /> Login
        </button>
      )}
    </div>
  );
};

export default Menu;
