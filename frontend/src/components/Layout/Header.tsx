import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Sun, Moon, Bug } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/bugs" className="logo">
          <span>Debug Diary</span>
        </Link>
        
        <nav className="nav">
          <Link to="/bugs" className="nav-link">Bugs</Link>
          <Link to="/reusable-fixes" className="nav-link">Fixes</Link>
          <Link to="/timeline" className="nav-link">Timeline</Link>
        </nav>

        <div className="header-actions">
          <button onClick={toggleTheme} className="icon-button">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          <span className="user-email">{user?.email}</span>
          
          <button onClick={handleLogout} className="icon-button">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;