import React from "react";
import "./Header.css";
import { FaBell, FaBars } from "react-icons/fa";

const Header = ({ onMenuClick }) => {
  return (
    <header className="header-container">
      <div className="header-left">
        {}
        <img
          src="/assets/bus-icon.svg"
          alt="SSB Icon"
          className="header-bus-icon"
        />
        <h1 className="header-title">SSB 1.0</h1>
        <span className="header-subtitle">Smart School Bus</span>
      </div>
      <div className="header-right">
        <div className="notification-icon">
          <FaBell size={20} />
          <span className="notification-badge">3</span>
        </div>
        {}
        <div className="menu-icon" onClick={onMenuClick}>
          <FaBars size={20} />
        </div>
      </div>
    </header>
  );
};

export default Header;
