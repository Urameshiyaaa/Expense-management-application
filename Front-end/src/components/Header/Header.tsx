import './Header.css';
import { useAuth } from '../../authentication/AuthState';

const Header = () => {
  const {logout, user} = useAuth();
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
  );
};

export default Header;

