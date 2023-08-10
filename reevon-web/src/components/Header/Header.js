import React from 'react';
import "bootstrap/dist/css/bootstrap.css";
import "./main.css";
import { Link } from 'react-router-dom';
import logoImage from '../../image/logo.png';

const Header = () => {

  const logoStyle = {
    width: '25px',  
    height: '50%', 
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg" id="nav">
        <Link className="navbar-brand Item" to="/" target="_self">
        <img src={logoImage} alt="Logo" style={logoStyle} /> Reevon
        </Link>
        <div className="navbar-collapse justify-content-end" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link Item" to="/file-encrypt" target="_self">
                <i className="fas fa-lock"></i> Encrypter
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link Item" to="/file-decrypt" target="_self">
                <i className="fas fa-unlock"></i> Decrypter
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Header;