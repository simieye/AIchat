// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

// @ts-ignore;
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
export function Chart({
  data
}) {
  // 按指标分组数据
  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.name]) {
      acc[item.name] = [];
    }
    acc[item.name].push(item);
    return acc;
  }, {});
  // 转换为图表需要的格式
  const chartData = Object.entries(groupedData).map(([date, items]) => {
    const entry = {
      date
    };
    items.forEach(item => {
      entry[item.metric] = item.value;
    });
    return entry;
  });
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
              <Line type="monotone" dataKey="total_leads" stroke="#8884d8" name="Leads" />
              <Line type="monotone" dataKey="total_messages" stroke="#82ca9d" name="Messages" />
              <Line type="monotone" dataKey="total_views" stroke="#ffc658" name="Views" />
              <Line type="monotone" dataKey="total_revenue" stroke="#ff7300" name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>;
}