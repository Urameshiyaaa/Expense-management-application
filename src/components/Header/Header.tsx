import './Header.css';
import { useAuth } from '../../Authentication/AuthState';

const Header = () => {
  const {logout} = useAuth();

  const Logout = () => {
    if (window.confirm('Bạn có muốn đăng xuất không?')) {
      logout();
    }
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-logo">Ứng dụng Quản lý chi tiêu</div>
        
        <div className="header-user-profile">
          <img 
            src=""
            alt="User Avatar" 
            className="user-avt"
            onClick={Logout}
            title="Nhấn để đăng xuất"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;

