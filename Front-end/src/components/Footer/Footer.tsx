const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#001529] text-white text-sm pt-[6px] px-[1px] pb-[1px]">
      <div className="max-w-[1200px] mx-auto border-t border-[#ffffff1a] text-center text-[#6c757d]">
        <p>&copy;{currentYear} Copyright 2025 Igata Kuraitoku. All rights reserved.</p>
        <p>Liên hệ: <a href='mailto:p.mduc.ptit@gmail.com' className="no-underline text-[#1877f2] hover:underline">p.mduc.ptit@gmail.com</a></p>
      </div>
    </footer>
  );
};

export default Footer;