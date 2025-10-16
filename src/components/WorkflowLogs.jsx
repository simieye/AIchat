// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';
// @ts-ignore;
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export function WorkflowLogs({
  logs
}) {
  const getStatusIcon = status => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };
  const getStatusColor = status => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };
  return <Card>
      <CardHeader>
        <CardTitle>Recent Workflow Runs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.map(log => <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="mt-1">
                {getStatusIcon(log.status)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{log.workflowName}</span>
                  <Badge className={getStatusColor(log.status)}>{log.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                  <span>{log.triggeredBy}</span>
                  <span>{log.timestamp}</span>
                </div>
              </div>
            </div>)}
        </div>
      </CardContent>
    </Card>;
}