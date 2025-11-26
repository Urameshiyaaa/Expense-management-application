import Header from '../../components/Header/Header';
import ExpenseSection from '../../components/ExpenseSection';
import bgImage from '../../others/Illustration/KiritaniHarukaBirthday.webp';


const HomePage = () => {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundImage:`linear-gradient(#516c8b80, #4f678580),url(${bgImage})`,
      backgroundSize: 'cover',    
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      <Header/>
      <main style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto',}}>

        <h2>Chào mừng bạn đến với Ứng dụng Quản lý Chi tiêu</h2>
         {/* *Note: Sau khi code xong các component + logic tính toán thì các ông cho các component đó
         vào thư mục components, và import, gọi các component đó ở chỗ này (ý là vị trí tôi ghi cái note này* */}
        <ExpenseSection />

      </main>
    </div>
  );
};

export default HomePage;