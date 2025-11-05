import React, { useState } from 'react';
import './LoginPage.css';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Authentication/AuthState.tsx';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login(); 
    navigate('/');
  };

  const handleGoogle = () => { 
    login();
    navigate('/');
  };

  return (
    <div className="login-page">
       <div className="login-content">
        
        <div className="app-name-section">
          <h1 className="app-name">Ứng dụng Quản lý chi tiêu</h1>
          <p className="name-detail">
            Giúp bạn theo dõi và quản lý chi tiêu hàng ngày một cách thông minh.
          </p>
        </div>

        <div className="login-form-section">
          <div className="login-form">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Tên đăng nhập"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="login-button">
                Đăng nhập
              </button>
              
              <hr/>
              
              <div className="google-login">
                <GoogleLogin
                  onSuccess={handleGoogle}
                  useOneTap={false}
                  shape="rectangular"
                  logo_alignment="center"
                  width="360px"
                />
              </div>

              <button 
                type="button" 
                className="create-account-button"

              >
                Tạo tài khoản mới
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;