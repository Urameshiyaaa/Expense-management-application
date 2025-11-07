import React, { useState } from 'react';
import './LoginPage.css';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authentication/AuthState';
import { loginUser, loginWithGoogleToken } from '../../authentication/AuthAPI';


const LoginPage = () => { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const toRegister = () => {
    navigate('/register');
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); 

    try {
      const data = await loginUser(email, password);
      login(data.user);
      navigate('/');
    }
    catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Đăng nhập thất bại.');
    }
  };

  const showGGError = () => {
    console.error('Đăng nhập Google thất bại');
    setError('Đăng nhập Google thất bại. Vui lòng thử lại.');
  };

  const handleGoogle = async (credentialResponse: CredentialResponse) => { 
    setError(null);

    if (credentialResponse.credential) {
      try {
        const data = await loginWithGoogleToken(credentialResponse.credential);
        login(data.user);
        navigate('/');
      } 
      catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || 'Đăng nhập Google thất bại.');
      }
    } 
    else {
      showGGError(); 
    }
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
            {error && <p style={{color: 'red',textAlign:'center'}}>{error}</p>}
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
                  onError={showGGError}
                  useOneTap={false}
                  shape="rectangular"
                  logo_alignment="center"
                  width="360px"
                />
              </div>
              <button 
                type="button" 
                className="create-account-button"
                onClick={toRegister}
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