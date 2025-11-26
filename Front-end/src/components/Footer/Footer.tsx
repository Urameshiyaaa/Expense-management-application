import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-bottom">
        <p>&copy;{currentYear} Copyright 2025 Igata Kuraitoku. All rights reserved.</p>
        <p>Liên hệ: <a href='mailto:p.mduc.ptit@gmail.com' style={{textDecoration:'none', color:'#1877f2'}}>p.mduc.ptit@gmail.com</a></p>
      </div>
    </footer>
  );
};

export default Footer;