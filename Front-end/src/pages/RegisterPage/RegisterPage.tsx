import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../authentication/AuthAPI';
import '../LoginPage/LoginPage.css'; 


const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const data = await registerUser(email, fullName, password);
      setSuccess(data.message + ' Bạn sẽ được chuyển về trang đăng nhập sau 2 giây');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } 
    catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Email đã tồn tại.');
    }
  };
  return (
    <div className="login-page">
      <div className="login-content">
        <div className="app-name-section">
          <h1 className="app-name">Ứng dụng Quản lý chi tiêu</h1>
          <p className="name-detail">Tạo tài khoản để bắt đầu quản lý chi tiêu của bạn.</p>
        </div>

        <div className="login-form-section">
          <div className="login-form">
            {error && <p style={{color:'red',textAlign:'center',fontSize:'14px'}}>{error}</p>}
            {success && <p style={{color:'green',textAlign:'center',fontSize:'14px'}}>{success}</p>}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Họ và Tên"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <input
                style={{}}
                type="email" 
                placeholder="Email"
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
              
              <button type="submit" className="create-account-button">Đăng ký</button>

              <hr/>

              <Link to="/login" className="to-login">Đã có tài khoản? Đăng nhập</Link>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;