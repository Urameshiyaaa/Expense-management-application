import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getYearlyReport } from '../API/reportsApi';

// Định nghĩa kiểu dữ liệu khớp với Backend
type YearItem = { 
  month: number; 
  spent: number; 
  budget: number; 
  overrun: number; // Số tiền vượt
};

export const YearlyReport: React.FC<{ userId: number; year: number }> = ({ userId, year }) => {
  const [data, setData] = useState<YearItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getYearlyReport(userId, year)
      .then((res: any) => {
         // Đảm bảo data là mảng
         const rawData = res.data || res;
         setData(Array.isArray(rawData) ? rawData : []);
      })
      .catch((err: any) => { console.error(err); setData([]); })
      .finally(() => setLoading(false));
  }, [userId, year]);

  if (loading) return <div style={{textAlign: 'center', padding: 20}}>Đang tải biểu đồ năm...</div>;
  if (!data.length) return <div style={{textAlign: 'center', padding: 20, color: '#666'}}>Chưa có dữ liệu năm {year}</div>;

  // Chuẩn bị data cho biểu đồ (Thêm nhãn tháng)
  const chartData = data.map(d => ({ 
    ...d, 
    monthLabel: `Th ${d.month}`,
    // Đảm bảo các số liệu không bị null
    spent: Number(d.spent || 0),
    budget: Number(d.budget || 0),
    overrun: Number(d.overrun || 0)
  }));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Tổng quan năm {year}</h3>
      
      <div style={{ flex: 1, minHeight: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="monthLabel" />
            <YAxis tickFormatter={(value) => `${value / 1000}k`} /> {/* Rút gọn số trục Y */}
            <Tooltip 
              formatter={(value: number) => `${value.toLocaleString()} VNĐ`}
              labelStyle={{ color: '#333', fontWeight: 'bold' }}
            />
            <Legend />
            
            {/* Cột 1: Ngân sách (Màu xanh lá) */}
            <Bar dataKey="budget" name="Định mức" fill="#52c41a" radius={[4, 4, 0, 0]} maxBarSize={50} />
            
            {/* Cột 2: Thực chi (Màu xanh dương) */}
            <Bar dataKey="spent" name="Thực chi" fill="#1890ff" radius={[4, 4, 0, 0]} maxBarSize={50} />
            
            {/* (Tùy chọn) Cột 3: Vượt mức (Màu đỏ) - Chỉ hiện khi có vượt */}
             {/* <Bar dataKey="overrun" name="Vượt mức" fill="#ff4d4f" /> */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default YearlyReport;
