import "./Footer.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <h2>SK KART</h2>
          <p>Your one-stop shop for everything!</p>
        </div>

        <div className="footer-links">
          <h4>Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </div>
       <div className="footer-socials">
          <h4>Follow Us</h4>
          <div className="footer-social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="https://github.com/golti-saikiran" target="_blank"><FaGithub /></a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
 
        <p>&copy; {new Date().getFullYear()} SK KART. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
