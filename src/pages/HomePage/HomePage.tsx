import Header from '../../components/Header/Header';


const HomePage = () => {
  return (
    <div style={{backgroundImage: ""}}>
      <Header />
      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2>Chào mừng bạn đến với Ứng dụng Quản lý chi tiêu!</h2>
        {/* *Note: Sau khi code xong các component + logic tính toán thì các ông cho các component đó
         vào thư mục components, và import, gọi các component đó ở chỗ này (ý là vị trí tôi ghi cái note này* */}
      </main>
    </div>
  );
};

export default HomePage;