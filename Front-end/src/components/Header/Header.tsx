import './Header.css';
import {useAuth} from '../../authentication/AuthState';
import {useState} from 'react';
import {Link} from 'react-router-dom';

const Header = () => {
  const {logout, user} = useAuth();
  const [displaySidebar, setDisplaySidebar] = useState(false);

  const Logout = () => {
    if (window.confirm('Bạn có muốn đăng xuất không?')) {
      logout();
    }
  };

  const handleSidebar = () => {
    setDisplaySidebar(!displaySidebar);
  };

  return (
    <>
    <header className="app-header">
      <div className="header-content">

        <button className="menu-btn" onClick={handleSidebar}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="white" >
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>

        <div className="header-logo">Ứng dụng Quản lý chi tiêu</div>
        
        <div className="header-user-profile">
          {user && user.avatar_url && (
            <img 
              src="https://static.wikitide.net/projectsekaiwiki/thumb/f/f6/Haruka_Casual_chibi.png/180px-Haruka_Casual_chibi.png" 
              alt="User Avatar" 
              className="user-avt" 
              onClick={Logout}
              title="Nhấn để đăng xuất"
            />
          )}

          {user && !user.avatar_url && (
            <div 
              className="user-avt-text" 
              onClick={Logout}
              title="Nhấn để đăng xuất"
            >
             {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
            </div>
          )}

        </div>
      </div>
    </header>

    <div className={`sidebar-overlay ${displaySidebar ? 'active' : ''}`} onClick={handleSidebar}></div>
      <nav className={`app-sidebar ${displaySidebar ? 'open' : ''}`}>

        <div className="sidebar-header">
          <h3>Menu</h3>
          <button className="close-btn" onClick={handleSidebar} >&times;</button>
        </div>
        
        <ul className="sidebar-menu">
          <li>
            <Link to="/" onClick={handleSidebar}>
              <span className="icon">🏠</span> Trang chủ
            </Link>
          </li>
    
          <li>
            <Link to="/budgets" onClick={handleSidebar}>
              <span className="icon">💰</span> Ngân sách định mức
            </Link>
          </li>

          <li>
            <Link to="/reports" onClick={handleSidebar}>
              <span className="icon">📊</span> Báo cáo thống kê
            </Link>
          </li>
        </ul>

      </nav>

  </>
  );
};

export default Header;

