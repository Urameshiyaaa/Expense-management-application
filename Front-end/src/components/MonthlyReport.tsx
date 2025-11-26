// src/components/MonthlyReport.tsx
import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { getMonthlyReport } from '../API/reportsApi'; //Đức: fix import

type Category = { category: string; amount: number };
type MonthlyResp = {
  monthTotal: number;
  budget: number | null;
  pctOfBudget: number | null;
  overBudget: number;
  byCategory: Category[];
};

export const MonthlyReport: React.FC<{ userId: number; year: number; month: number }> = ({ userId, year, month }) => {
  const [data, setData] = useState<MonthlyResp | null>(null);
  const [loading, setLoading] = useState(true);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A52A2A', '#8A2BE2', '#FF1493'];

  useEffect(() => {
    console.log("Check dữ liệu gửi đi", { userId, year, month }); //Đức: debug
    setLoading(true);
    getMonthlyReport(userId, year, month)
      .then((res: { data: React.SetStateAction<MonthlyResp | null>; }) => setData(res.data))
      .catch((err: any) => { console.error(err); setData(null); })
      .finally(() => setLoading(false));
  }, [userId, year, month]);

  console.log("Dữ liệu nhận được:", data) //Đức: debug
  if (loading) return <div>Đang tải...</div>;
  if (!data) return <div>Không có dữ liệu</div>;

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>
            Tổng chi: {(data.monthTotal || 0).toLocaleString()} VNĐ
        </div>

        <div style={{ color: '#666' }}>
          Định mức: {typeof data.budget === 'number' ? `${data.budget.toLocaleString()} VNĐ` : 'Chưa có'} {' '}
          {typeof data.pctOfBudget === 'number' && ` · ${data.pctOfBudget}%`}
        </div>
        {(data.overBudget || 0) > 0 && (
          <div style={{
            marginTop: 8,
            background: '#fff4f4',
            border: '1px solid #ff8a8a',
            padding: 8,
            borderRadius: 6,
            color: '#a8071a',
            fontWeight: 700
          }}>
            ⚠️ Vượt định mức {(data.overBudget || 0).toLocaleString()} VNĐ
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ width: 360, height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data.byCategory} dataKey="amount" nameKey="category" outerRadius={100} label>
                {data.byCategory.map((_entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => `${v.toLocaleString()} VNĐ`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ minWidth: 220, flex: 1 }}>
          <h4>Chi theo danh mục</h4>
          <ul style={{ padding: 0, margin: 0 }}>
            {data.byCategory.map((c, i) => (
              <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #eee' }}>
                <span>{c.category}</span>
                <span>{c.amount.toLocaleString()} VNĐ</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MonthlyReport;
