// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Input, useToast } from '@/components/ui';

// @ts-ignore;
import { Layout } from '@/components/Layout';
import { LeadList } from '@/components/LeadList';
import { LeadDetailSheet } from '@/components/LeadDetailSheet';
export default function Leads(props) {
  const [isDark, setIsDark] = useState(true);
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
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
  const fetchLeads = async () => {
    try {
      const result = await props.$w.cloud.callDataSource({
        dataSourceName: 'lead',
        methodName: 'wedaGetRecordsV2',
        params: {
          orderBy: [{
            last_interaction_at: 'desc'
          }],
          getCount: true
        }
      });
      if (result.records) {
        setLeads(result.records.map(lead => ({
          id: lead._id,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          avatar: lead.avatar,
          tags: lead.tags || [],
          source: lead.platform,
          lastInteraction: new Date(lead.last_interaction_at).toLocaleDateString(),
          status: lead.status || 'new',
          interactions: lead.interactions || [],
          notes: lead.notes || ''
        })));
      }
    } catch (error) {
      toast({
        title: "Error loading leads",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLeads();
  }, []);
  const filteredLeads = leads.filter(lead => lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || lead.email.toLowerCase().includes(searchTerm.toLowerCase()) || lead.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
  const handleViewDetails = lead => {
    setSelectedLead(lead);
    setSheetOpen(true);
  };
  if (loading) {
    return <Layout activePage="leads" onNavigate={handleNavigate} isDark={isDark} onToggleTheme={toggleTheme}>
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading leads...</div>
        </div>
      </div>
    </Layout>;
  }
  return <Layout activePage="leads" onNavigate={handleNavigate} isDark={isDark} onToggleTheme={toggleTheme}>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground">Leads</h2>
          <p className="text-muted-foreground">Manage and track your potential customers</p>
        </div>

        <div className="mb-4">
          <Input placeholder="Search leads by name, email, or tags..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="max-w-md" />
        </div>

        <LeadList leads={filteredLeads} onViewDetails={handleViewDetails} />
        <LeadDetailSheet lead={selectedLead} open={sheetOpen} onOpenChange={setSheetOpen} />
      </div>
    </Layout>;
}