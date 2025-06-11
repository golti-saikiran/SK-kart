import React, { useState } from 'react';
import './ProfilePage.css';
import DashBoardPageLayout from '../../layout/DashBoard/DashBoardPageLayout';
import useStore from '../../Store/store';
import { FaEdit, FaSave, FaSun, FaMoon, FaUser } from 'react-icons/fa';

const ProfilePage = () => {
  const [name, setName] = useState('John Doe');
  const [mobile, setMobile] = useState('123-456-7890');
  const [image, setImage] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingMobile, setIsEditingMobile] = useState(false);

  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobile(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTheme = () => {
    setTheme();
  };

  return (
    <DashBoardPageLayout title="Profile">
      <div className="profile-container">
        <div className="profile-image-section">
          {image ? <img src={image} alt="Profile" className="profile-image" /> : <FaUser className="profile-image" />}
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="image-upload-input"
            />
            <button>Upload</button>
          </>
        </div>

        <div className="profile-info-section">
          {/* Name */}
          <div className="profile-field">
            <label>Name</label>
            {isEditingName ? (
              <>
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  className="input-field"
                />
                <button onClick={() => setIsEditingName(false)} className="icon-button">
                  <FaSave />
                </button>
              </>
            ) : (
              <>
                <p>{name}</p>
                <button onClick={() => setIsEditingName(true)} className="icon-button">
                  <FaEdit />
                </button>
              </>
            )}
          </div>

          {/* Mobile */}
          <div className="profile-field">
            <label>Mobile Number</label>
            {isEditingMobile ? (
              <>
                <input
                  type="text"
                  value={mobile}
                  onChange={handleMobileChange}
                  className="input-field"
                />
                <button onClick={() => setIsEditingMobile(false)} className="icon-button">
                  <FaSave />
                </button>
              </>
            ) : (
              <>
                <p>{mobile}</p>
                <button onClick={() => setIsEditingMobile(true)} className="icon-button">
                  <FaEdit />
                </button>
              </>
            )}
          </div>

          {/* Theme Toggle */}
          <div className="profile-field">
            <label>Theme</label>
            <button onClick={toggleTheme} className="theme-toggle-btn">
              {theme === 'light' ? <FaMoon /> : <FaSun />} {theme === 'light' ? 'Dark' : 'Light'} Mode
            </button>
          </div>
        </div>
      </div>
    </DashBoardPageLayout>
  );
};

export default ProfilePage;
