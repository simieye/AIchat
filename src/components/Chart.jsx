// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

// @ts-ignore;
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
export function Chart({
  data
}) {
  // 按指标类型分组数据
  const groupedData = data.reduce((acc, item) => {
    const date = item.name;
    if (!acc[date]) {
      acc[date] = {
        date: date
      };
    }
    acc[date][item.metric] = item.value;
    return acc;
  }, {});
  const chartData = Object.values(groupedData);
  return <Card>
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total_leads" stroke="#8884d8" name="Leads" strokeWidth={2} />
              <Line type="monotone" dataKey="total_messages" stroke="#82ca9d" name="Messages" strokeWidth={2} />
              <Line type="monotone" dataKey="total_views" stroke="#ffc658" name="Views" strokeWidth={2} />
              <Line type="monotone" dataKey="total_revenue" stroke="#ff7300" name="Revenue" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>;
}