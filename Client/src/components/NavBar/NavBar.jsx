import React, { useState } from 'react';
import './NavBar.css';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);


  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };



  return (
    <div id="NavBar">
      {/* <div className="logo-container">
        <a href="/" className="logo">MyApp</a>
      </div> */}
      
      <div className={`hamburger ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      <div className={`nav-links ${isOpen ? 'open' : ''}`}>

        <Link to="/create" 
        className="nav-link">Create</Link>

        <Link to="/about" 
        className="nav-link">About</Link>

        <Link to="/contact" 
        className="nav-link">Contact</Link>

        <Link to="/order" 
        className="nav-link">Order</Link>

       <Link to="/cart" 
        className="nav-link"
        id='cart'>Cart</Link>

      {/* <div className="auth-links">
        <Link to="/login"
                 style={{fontSize: '10px'}}

        className="auth-link">Login</Link>
       
        <Link to="/reg" 
                style={{fontSize: '10px'}}
                
                className="auth-link">Register</Link>
                </div> */}
      </div>
    </div>
  );
};

export default NavBar;
