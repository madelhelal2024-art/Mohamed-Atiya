import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface ProgressDataPoint {
  name: string;
  completion: number;
}

interface ThemeProgressLineChartProps {
  data: ProgressDataPoint[];
  color?: string;
}

export const ThemeProgressLineChart: React.FC<ThemeProgressLineChartProps> = ({
  data,
  color = '#2563EB',
}) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
        لا توجد بيانات تقدم دراسي متاحة حالياً
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748B' }} />
          <Tooltip
            formatter={(value: any) => [`${value}%`, 'نسبة الإنجاز']}
            contentStyle={{ direction: 'rtl', borderRadius: '8px', border: '1px solid #CBD5E1' }}
          />
          <Bar dataKey="completion" fill={color} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
