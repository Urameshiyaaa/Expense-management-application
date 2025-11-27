import React, {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {registerUser} from '../../authentication/AuthAPI';
import './RegisterPage.css';

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

    try{
      const data = await registerUser(email, fullName, password);
      setSuccess(data.message + ' Bạn sẽ được chuyển về trang đăng nhập sau 2 giây');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } 
    catch (err: any){
      setError(err.response?.data?.message || 'Đăng ký thất bại. Email đã tồn tại.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-content">
        
        <div className="register-header-section">
          <h1 className="register-title">Ứng dụng Quản lý chi tiêu</h1>
          <p className="register-subtitle">Tạo tài khoản để bắt đầu quản lý tài chính thông minh.</p>
        </div>

        <div className="register-form">
            
            {error && <div style={{backgroundColor: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '6px', marginBottom: '15px', textAlign: 'center', fontSize: '14px'}}>{error}</div>}
            {success && <div style={{backgroundColor: '#dcfce7', color: '#166534', padding: '10px', borderRadius: '6px', marginBottom: '15px', textAlign: 'center', fontSize: '14px'}}>{success}</div>}

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Họ và tên"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{color:"black"}}
              />
              <input
                type="email" 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{color:"black"}}
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{color:"black"}}
              />
              
              <button type="submit" className="btn-register">Đăng ký tài khoản</button>

              <hr className="divider"/>

              <Link to="/login" className="link-login">Đã có tài khoản? <b>Đăng nhập ngay</b></Link>
            </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;