import './Header.css';
import {useAuth} from '../../authentication/AuthState';
import {useState} from 'react';
import {Link} from 'react-router-dom';

const Header = () => {
  const {logout, user} = useAuth();
  const [displaySidebar, setDisplaySidebar] = useState(false);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const clickAvatar = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
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
              onClick={clickAvatar}
              title="Nhấn để đăng xuất"
            />
          )}

          {user && !user.avatar_url && (
            <div 
              className="user-avt-text" 
              onClick={clickAvatar}
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


      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[2006] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-[90%] max-w-[400px]">
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Đăng xuất?</h3>
              <p className="text-sm text-gray-500">
                Bạn có chắc chắn muốn đăng xuất khỏi tài khoản <br/>
                <span className="font-bold text-gray-800">{user?.full_name || user?.email}</span> không?
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2.5 hover:text-[red] font-medium text-sm"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={confirmLogout}
                className="flex-1 px-4 py-2.5 hover:text-[red] font-medium text-sm"
              >
                Đăng xuất ngay
              </button>
            </div>

          </div>
        </div>
      )}

  </>
  );
};

export default Header;

