// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
// @ts-ignore;
import { TrendingUp, TrendingDown } from 'lucide-react';

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  prefix = '',
  suffix = ''
}) {
  const isPositive = change >= 0;
  return <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </div>
        <div className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
          {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
          {Math.abs(change)}%
        </div>
      </CardContent>
    </Card>;
}