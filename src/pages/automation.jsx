// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, useToast } from '@/components/ui';
// @ts-ignore;
import { Plus, Zap } from 'lucide-react';

import { Layout } from '@/components/Layout';
import { WorkflowCard } from '@/components/WorkflowCard';
import { WorkflowCreator } from '@/components/WorkflowCreator';
import { WorkflowLogs } from '@/components/WorkflowLogs';
export default function Automation(props) {
  const [isDark, setIsDark] = useState(true);
  const [workflows, setWorkflows] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showCreator, setShowCreator] = useState(false);
  const [loading, setLoading] = useState(true);
  const {
    toast
  } = useToast();
  const handleNavigate = pageId => {
    props.$w.utils.navigateTo({
      pageId,
      params: {}
    });
  };
  const toggleTheme = () => setIsDark(!isDark);
  const fetchWorkflows = async () => {
    try {
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'workflow',
        methodName: 'wedaGetRecordsV2',
        params: {
          orderBy: [{
            createdAt: 'desc'
          }],
          getCount: true
        }
      });
      if (result.records) {
        setWorkflows(result.records.map(workflow => ({
          id: workflow._id,
          name: workflow.name,
          conditions: workflow.trigger || {
            tags: [],
            platform: ''
          },
          action: workflow.actions?.[0] || {
            type: 'send_message',
            message: ''
          },
          status: workflow.status || 'active',
          enabled: workflow.enabled || false,
          lastRun: workflow.last_run ? new Date(workflow.last_run).toLocaleDateString() : 'Never',
          runCount: workflow.run_count || 0,
          description: workflow.description || ''
        })));
      }
    } catch (error) {
      toast({
        title: "Error loading workflows",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const fetchLogs = async () => {
    try {
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'workflow_log',
        methodName: 'wedaGetRecordsV2',
        params: {
          orderBy: [{
            executed_at: 'desc'
          }],
          pageSize: 10,
          getCount: true
        }
      });
      if (result.records) {
        setLogs(result.records.map(log => ({
          id: log._id,
          workflowName: log.workflow_name,
          status: log.status,
          details: log.details?.message || log.details || 'No details',
          triggeredBy: log.triggered_by || 'System',
          timestamp: new Date(log.executed_at).toLocaleString()
        })));
      }
    } catch (error) {
      toast({
        title: "Error loading logs",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  useEffect(() => {
    Promise.all([fetchWorkflows(), fetchLogs()]).finally(() => {
      setLoading(false);
    });
  }, []);
  const handleToggleStatus = async workflowId => {
    try {
      const workflow = workflows.find(w => w.id === workflowId);
      const newEnabled = !workflow.enabled;
      await props.$w.cloud.callDataSource({
        dataSourceName: 'workflow',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            enabled: newEnabled,
            status: newEnabled ? 'active' : 'paused',
            updatedAt: new Date().toISOString()
          },
          filter: {
            where: {
              _id: {
                $eq: workflowId
              }
            }
          }
        }
      });
      setWorkflows(workflows.map(w => w.id === workflowId ? {
        ...w,
        enabled: newEnabled,
        status: newEnabled ? 'active' : 'paused'
      } : w));
      toast({
        title: newEnabled ? 'Workflow activated' : 'Workflow paused',
        description: `${workflow.name} has been ${newEnabled ? 'activated' : 'paused'}.`
      });
    } catch (error) {
      toast({
        title: "Error updating workflow",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  const handleCreateWorkflow = async workflow => {
    try {
      await props.$w.cloud.callDataSource({
        dataSourceName: 'workflow',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            name: workflow.name,
            trigger: workflow.conditions,
            actions: [workflow.action],
            enabled: true,
            status: 'active',
            run_count: 0,
            description: `Auto workflow for ${workflow.conditions.platform} users`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      });
      toast({
        title: "Workflow created",
        description: `${workflow.name} has been created successfully.`
      });
      setShowCreator(false);
      await fetchWorkflows();
    } catch (error) {
      toast({
        title: "Error creating workflow",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  if (loading) {
    return <Layout activePage="automation" onNavigate={handleNavigate} isDark={isDark} onToggleTheme={toggleTheme}>
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading automation data...</div>
        </div>
      </div>
    </Layout>;
  }
  return <Layout activePage="automation" onNavigate={handleNavigate} isDark={isDark} onToggleTheme={toggleTheme}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Zap className="w-8 h-8" />
              Automation
            </h2>
            <p className="text-muted-foreground">Manage your automated workflows</p>
          </div>
          <Button onClick={() => setShowCreator(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Workflow
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold">Active Workflows</h3>
            {workflows.length === 0 ? <div className="text-center py-8 text-muted-foreground">
                No workflows found. Create your first workflow to get started.
              </div> : workflows.map(workflow => <WorkflowCard key={workflow.id} workflow={workflow} onToggleStatus={handleToggleStatus} />)}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            {logs.length === 0 ? <div className="text-center py-8 text-muted-foreground">
                No recent activity
              </div> : <WorkflowLogs logs={logs} />}
          </div>
        </div>

        {showCreator && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Create New Workflow</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowCreator(false)}>
                  Close
                </Button>
              </div>
              <WorkflowCreator onCreate={handleCreateWorkflow} />
            </div>
          </div>}
      </div>
    </Layout>;
}