import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { getMonthlyReport } from '../API/reportsApi';

// Định nghĩa lại kiểu dữ liệu cho khớp với Backend mới
type CategoryDetail = {
  category_id: number;
  category_name: string;
  spent: number;
  budget: number;
  over_amount: number;
};

type MonthlyResp = {
  monthTotal: number;
  budget: number;
  overBudget: number;
  categories: CategoryDetail[]; // Backend trả về 'categories', không phải 'byCategory'
};

export const MonthlyReport: React.FC<{ userId: number; year: number; month: number }> = ({ userId, year, month }) => {
  const [data, setData] = useState<MonthlyResp | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Bảng màu cho biểu đồ
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A52A2A', '#8A2BE2', '#FF1493'];

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getMonthlyReport(userId, year, month)
      .then((res: any) => setData(res.data || res)) // Xử lý trường hợp axios trả về
      .catch((err: any) => { console.error(err); setData(null); })
      .finally(() => setLoading(false));
  }, [userId, year, month]);

  if (loading) return <div style={{textAlign: 'center', padding: 20}}>Đang tải biểu đồ...</div>;
  if (!data || !data.categories || data.categories.length === 0) return <div style={{textAlign: 'center', padding: 20, color: '#666'}}>Chưa có dữ liệu chi tiêu tháng này</div>;

  const chartData = data.categories
    .map(cat => ({
      ...cat,
      spent: Number(cat.spent), // Chuyển chuỗi thành số
      name: cat.category_name
    }))
    .filter(cat => cat.spent > 0); // Chỉ vẽ những cái > 0

  // === BƯỚC 2: KIỂM TRA NẾU TỔNG CHI = 0 ===
  if (chartData.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
         <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Phân tích chi tiêu</h3>
         <div style={{textAlign: 'center', padding: '40px', color: '#999', border: '2px dashed #eee', borderRadius: '8px'}}>
            <p>Tháng này chưa tiêu đồng nào! 🎉</p>
            <p style={{fontSize: '0.9em'}}>Hãy thêm khoản chi để xem biểu đồ.</p>
         </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Phân tích chi tiêu</h3>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {/* --- PHẦN 1: BIỂU ĐỒ TRÒN --- */}
        <div style={{ flex: 1, minWidth: '300px', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={chartData}
                dataKey="spent" // Dùng 'spent' thay vì 'amount'
                nameKey="category_name" // Dùng 'category_name'
                cx="50%" 
                cy="50%" 
                outerRadius={80} 
                label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
              >
                {chartData.map((_entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => `${v.toLocaleString()} VNĐ`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* --- PHẦN 2: DANH SÁCH CHI TIẾT (CÓ BÁO VƯỢT) --- */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h4 style={{marginBottom: 10, borderBottom: '1px solid #eee', paddingBottom: 5}}>Chi tiết danh mục</h4>
          <div style={{ maxHeight: '260px', overflowY: 'auto', paddingRight: 5 }}>
            <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
              {data.categories.map((cat, i) => {
                const isOver = cat.over_amount > 0;
                // Tính phần trăm đã dùng so với ngân sách (nếu có ngân sách)
                const percentUsage = cat.budget > 0 ? (cat.spent / cat.budget) * 100 : 0;
                
                return (
                  <li key={i} style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    padding: '10px 0', 
                    borderBottom: '1px solid #f0f0f0' 
                  }}>
                    {/* Dòng 1: Tên và Số tiền đã chi */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, color: '#333' }}>
                        <span style={{display: 'inline-block', width: 10, height: 10, borderRadius: '50%', backgroundColor: COLORS[i % COLORS.length], marginRight: 8}}></span>
                        {cat.category_name}
                      </span>
                      <span style={{ fontWeight: 'bold' }}>{Number(cat.spent).toLocaleString()} đ</span>
                    </div>

                    {/* Dòng 2: Ngân sách và Cảnh báo (Nếu có) */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85em', color: '#666' }}>
                      <span>
                        Định mức: {cat.budget > 0 ? `${Number(cat.budget).toLocaleString()} đ` : '---'}
                      </span>
                      
                      {/* Hiển thị trạng thái */}
                      {cat.budget > 0 && (
                        <span>
                          {isOver ? (
                            <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                              🔥 Vượt {Number(cat.over_amount).toLocaleString()} đ
                            </span>
                          ) : (
<span style={{ color: '#52c41a' }}>
                              ✅ Còn dư (dùng {percentUsage.toFixed(0)}%)
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReport;